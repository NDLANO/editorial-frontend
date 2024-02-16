/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, NodeEntry, Element, Node } from "slate";
import config from "../../../config";
import { NormalizerConfig, defaultBlockNormalizer } from "../utils/defaultNormalizer";

interface Props<T extends Node = Node> {
  type: Element["type"];
  normalize?: Normalize<T>[];
  normalizerConfig?: NormalizerConfig;
  onKeyDown?: Record<string, KeyDown>;
  isInline?: boolean;
  isVoid?: boolean;
}

interface Normalize<T extends Node = Node> {
  description: string;
  normalize(e: NodeEntry<T>, editor: Editor): boolean;
}

type KeyDown = (e: KeyboardEvent, editor: Editor, nextOnKeyDown?: (event: KeyboardEvent) => void) => void;

export const createPluginFactory =
  <T extends Node = Node>({ normalize, isVoid, type, onKeyDown, isInline, normalizerConfig }: Props<T>) =>
  (editor: Editor) => {
    const {
      isVoid: nextIsVoid,
      normalizeNode: nextNormalizeNode,
      isInline: nextIsInline,
      onKeyDown: nextOnKeyDown,
    } = editor;

    editor.isVoid = (e) => (e.type === type ? !!isVoid : nextIsVoid?.(e));
    editor.isInline = (e) => (e.type === type ? !!isInline : nextIsInline?.(e));

    editor.normalizeNode = (entry) => {
      const [node] = entry;
      if (Element.isElement(node) && node.type === type) {
        const defaultNormalized = normalizerConfig ? defaultBlockNormalizer(editor, entry, normalizerConfig) : false;
        const normalized = normalize?.reduceRight((acc, { description, normalize }) => {
          const isNormalized = normalize(entry as NodeEntry<T>, editor);
          if (config.debugSlate && isNormalized) {
            /* eslint-disable-next-line */
            console.debug(`[NORMALIZING] ${type} with method: ${description}`);
          }
          return acc || isNormalized;
        }, false);

        if (normalized || defaultNormalized) return;
      }

      return nextNormalizeNode?.(entry);
    };

    editor.onKeyDown = (e) => {
      if (onKeyDown?.[e.key]) {
        if (config.debugSlate) {
          /* eslint-disable-next-line */
          console.debug(`[KEYBOARDEVENT] ${type} with keyboardkey: ${e.key}`);
        }
        onKeyDown[e.key](e, editor, nextOnKeyDown);
      }
      return nextOnKeyDown?.(e);
    };

    return editor;
  };
