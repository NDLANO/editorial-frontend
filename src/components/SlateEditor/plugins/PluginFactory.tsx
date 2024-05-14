/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, NodeEntry, Element } from "slate";
import { RenderLeafProps } from "slate-react";
import config from "../../../config";
import { NormalizerConfig, defaultBlockNormalizer } from "../utils/defaultNormalizer";

type ElementType = Element["type"];

type MappedPlugins = {
  [K in ElementType]: Plugin<K>;
};

interface Plugin<T extends ElementType = ElementType> {
  /**
   * The unique identifier for the element in the slate context.
   */
  type: T;

  /**
   * Array of normalization objects containing a description and a normalisation method.
   */
  normalizeMethods?: Normalize<Extract<Element, { type: T }>>[];

  /**
   * Configuration object for the default block normalizer. If this is set, the default block normalizer will be used.
   */
  normalizeWithConfig?: NormalizerConfig;

  /**
   * onKeyDown is used to handle keyboard events for the element. Matches the string literal to the corresponding KeyboardEvent key.
   */
  onKeyDown?: Record<string, KeyDown<T>>;

  /**
   * Controls if the element should be considered an inline element in the slate context.
   * Slate defines Inline elements as elements that can place within a text node. In our use case a paragraph element.
   */
  isInline?: boolean;

  /**
   * Controls if the element should be considered a void element in the slate context.
   * A Void element is an element that can not have any children nodes as children, but do require a [{ text: "" }] array as a child for pathing purposes.
   */
  isVoid?: boolean;

  /**
   *  A method to control if the BlockPickerTrigger should be shown or not given the selection is in a node for this plugin.
   */
  shouldHideBlockPicker?: (editor: Editor) => boolean;

  /**
   *  A method to control wether the leafnode should be rendered with a specific JSX.element or be a default node.
   */
  renderLeaf?: (props: RenderLeafProps, editor: Editor) => JSX.Element | undefined;

  /**
   *  childPlugins is an array of plugins that should be added to the editor when the element is added.
   */
  childPlugins?: MappedPlugins[ElementType][];
}

/**
 * Normalize is an interface for the normalize methods. These methods are used in the normalizeNode function of the Slate editor.
 * This interface helps enforcing description for a given normalize method and enables a simple form of debugging.
 */
export interface Normalize<T extends Element> {
  /** Description explaining what the normalize method below does*/ description: string;
  /** Method to normalize a node to a normalized state */ normalize(e: NodeEntry<T>, editor: Editor): boolean;
}

export type KeyDown<T extends ElementType> = (
  e: KeyboardEvent,
  editor: Editor,
  event: NodeEntry<Extract<Element, { type: T }>>,
) => boolean;

const createPluginFactory =
  <T extends ElementType>({
    normalizeMethods,
    isVoid,
    type,
    onKeyDown,
    isInline,
    normalizeWithConfig,
    renderLeaf,
    shouldHideBlockPicker,
  }: Plugin<T>) =>
  (editor: Editor) => {
    const {
      isVoid: nextIsVoid,
      normalizeNode: nextNormalizeNode,
      isInline: nextIsInline,
      onKeyDown: nextOnKeyDown,
      renderLeaf: nextRenderLeaf,
      shouldHideBlockPicker: nextShouldHideBlockPicker,
    } = editor;

    editor.isVoid = (e) => (e.type === type ? !!isVoid : nextIsVoid?.(e));
    editor.isInline = (e) => (e.type === type ? !!isInline : nextIsInline?.(e));
    editor.renderLeaf = (props) => renderLeaf?.(props, editor) ?? nextRenderLeaf?.(props);
    editor.shouldHideBlockPicker = () => shouldHideBlockPicker?.(editor) ?? nextShouldHideBlockPicker?.();

    editor.normalizeNode = (entry) => {
      const [node] = entry;
      if (Element.isElement(node) && node.type === type) {
        if (normalizeWithConfig && defaultBlockNormalizer(editor, entry, normalizeWithConfig)) {
          if (config.debugSlate) {
            /* eslint-disable-next-line */
            console.debug(`[NORMALIZING] ${type} with method: DEFAULT BLOCK NORMALIZER `);
          }
          return;
        }
        const normalized = normalizeMethods?.find(({ normalize }) =>
          normalize(entry as NodeEntry<Extract<Element, { type: T }>>, editor),
        );

        if (normalized) {
          if (config.debugSlate) {
            /* eslint-disable-next-line */
            console.debug(`[NORMALIZING] ${type} with method: ${normalized.description}`);
          }
          return;
        }
      }

      return nextNormalizeNode?.(entry);
    };

    editor.onKeyDown = (e) => {
      if (onKeyDown?.[e.key]) {
        const [entry] = Editor.nodes(editor, { match: (node) => Element.isElement(node) && node.type === type });
        if (entry && onKeyDown[e.key](e, editor, entry as NodeEntry<Extract<Element, { type: T }>>)) {
          if (config.debugSlate) {
            /* eslint-disable-next-line */
            console.debug(`[KEYBOARDEVENT] ${type} with keyboardkey: ${e.key}`);
          }
          return;
        }
      }
      return nextOnKeyDown?.(e);
    };

    return editor;
  };

export const createPlugin = <T extends ElementType>(data: Plugin<T>) => {
  const plugins: Plugin<T>[] = [data];
  if (data.childPlugins) {
    data.childPlugins.forEach((plg) => plugins.push(plg as Plugin<T>));
  }
  return plugins.map(createPluginFactory);
};
