/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, NodeEntry } from "slate";
import { Element } from "slate";
import { NormalizerConfig, defaultBlockNormalizer } from "../utils/defaultNormalizer";

interface Props {
  type: Element["type"];
  normalize?: Normalize[];
  normalizerConfig?: NormalizerConfig;
  onKeyDown?: Record<string, KeyDown>;
  isInline?: boolean;
  isVoid?: boolean;
}

interface Normalize {
  description: string;
  normalize: (e: NodeEntry) => boolean;
}

interface KeyDown {
  method: (e: KeyboardEvent) => void;
  description: string;
}

const createPluginFactory =
  ({ normalize, isVoid, type, onKeyDown, isInline, normalizerConfig }: Props) =>
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
        if (normalizerConfig) {
          if (defaultBlockNormalizer(editor, entry, normalizerConfig)) return;
        }

        const normalized = normalize?.reduceRight((acc, { description, normalize }) => {
          const isNormalized = normalize(entry);
          if (process.env.DEBUG_SLATE && isNormalized) {
            console.log(`[NORMALIZING] ${type} with method: ${description}`);
          }
          return acc && isNormalized;
        }, false);

        if (normalized) return;
      }

      return nextNormalizeNode?.(entry);
    };

    editor.onKeyDown = (e) => {
      if (onKeyDown?.[e.key]) {
        const { method, description } = onKeyDown?.[e.key];
        if (process.env.DEBUG_SLATE) {
          console.log(`[KEYBOARDEVENT] ${type} with method: ${description}`);
        }

        method(e);
      }
      return nextOnKeyDown?.(e);
    };

    return editor;
  };

export default createPluginFactory;
