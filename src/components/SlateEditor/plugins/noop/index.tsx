/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Transforms, Text } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_NOOP } from "./types";
import { SlateSerializer } from "../../interfaces";
import { inlineElements } from "../../utils/normalizationHelpers";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { isParagraph } from "../paragraph/utils";

export interface NoopElement {
  type: "noop";
  children: Descendant[];
}

export const noopSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== "div") return;
    if (el.attributes.getNamedItem("data-noop")?.value === "true") {
      return slatejsx("element", { type: TYPE_NOOP }, children);
    }
  },
  serialize(node, children) {
    if (!Element.isElement(node) || node.type !== TYPE_NOOP) return;
    return children;
  },
};

export const noopPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_NOOP) {
      if (node?.children.length === 1) {
        const child = node.children[0];
        if (Text.isText(child)) {
          Transforms.wrapNodes(editor, slatejsx("element", { type: TYPE_PARAGRAPH, serializeAsText: true }, child), {
            at: [...path, 0],
          });
          return;
        }
        const containsInlineBlock = !!child.children.find(
          (n) => Element.isElement(n) && inlineElements.includes(n.type),
        );

        // Don't serialize single paragraph block without inlines as Paragraph
        if (isParagraph(child) && !child.serializeAsText && !containsInlineBlock) {
          Transforms.setNodes(
            editor,
            { type: TYPE_PARAGRAPH, serializeAsText: true },
            { at: path, match: (n) => isParagraph(n) },
          );
          return;
        }

        // Serialize single paragraph block that contains inlines as Paragraph
        if (isParagraph(child) && containsInlineBlock && child.serializeAsText) {
          Transforms.setNodes(
            editor,
            { type: TYPE_PARAGRAPH, serializeAsText: false },
            { at: path, match: (n) => isParagraph(n) },
          );
        }
        return;
      }

      // If multiple blocks serialize as paragraphs
      if (node?.children.length > 1) {
        Transforms.setNodes(
          editor,
          { type: TYPE_PARAGRAPH, serializeAsText: false },
          { at: path, match: (n) => isParagraph(n) },
        );
        return;
      }
    }

    return nextNormalizeNode(entry);
  };

  return editor;
};
