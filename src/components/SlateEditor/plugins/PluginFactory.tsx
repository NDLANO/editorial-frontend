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
  type: T;
  normalize?: Normalize<Extract<Element, { type: T }>>[];
  normalizerConfig?: NormalizerConfig;
  onKeyDown?: Record<string, KeyDown>;
  isInline?: boolean;
  isVoid?: boolean;
  shouldHideBlockPicker?: (editor: Editor) => boolean;
  renderLeaf?: (props: RenderLeafProps, editor: Editor) => JSX.Element | undefined;
  childPlugins?: MappedPlugins[ElementType][];
}

interface Normalize<T extends Element> {
  description: string;
  normalize(e: NodeEntry<T>, editor: Editor): boolean;
}

type KeyDown = (e: KeyboardEvent, editor: Editor, nextOnKeyDown?: (event: KeyboardEvent) => void) => void;

export const createPluginFactory =
  <T extends ElementType>({
    normalize,
    isVoid,
    type,
    onKeyDown,
    isInline,
    normalizerConfig,
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
        if (normalizerConfig && defaultBlockNormalizer(editor, entry, normalizerConfig)) {
          if (config.debugSlate) {
            /* eslint-disable-next-line */
            console.debug(`[NORMALIZING] ${type} with method: DEFAULT BLOCK NORMALIZER `);
          }
          return;
        }
        const normalized = normalize?.find(({ normalize }) =>
          normalize(entry as NodeEntry<Extract<Element, { type: T }>>, editor),
        );

        if (normalized) {
          if (config.debugSlate) {
            /* eslint-disable-next-line */
            console.debug(`[NORMALIZING] ${type} with method: ${normalized.description}`);
          }
        }
      }

      return nextNormalizeNode?.(entry);
    };

    editor.onKeyDown = (e) => {
      const [entry] = Editor.nodes(editor, { match: (node) => Element.isElement(node) && node.type === type });
      if (entry) {
        if (onKeyDown?.[e.key]) {
          if (config.debugSlate) {
            /* eslint-disable-next-line */
            console.debug(`[KEYBOARDEVENT] ${type} with keyboardkey: ${e.key}`);
          }
          onKeyDown[e.key](e, editor, nextOnKeyDown);
        }
      }
      return nextOnKeyDown?.(e);
    };

    return editor;
  };

export const createPlugin = <T extends ElementType>(data: Plugin<T>) => {
  const plugins: any[] = [data];
  if (data.childPlugins) {
    data.childPlugins.forEach((plg) => plugins.push(plg));
  }
  return plugins.map(createPluginFactory);
};
