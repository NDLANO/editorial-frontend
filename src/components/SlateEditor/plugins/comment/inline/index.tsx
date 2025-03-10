/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Node, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_COMMENT_INLINE } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../../interfaces";
import { TYPE_NDLA_EMBED } from "../../embed/types";

export const commentInlineSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource === "comment" && embedAttributes.type === "inline") {
      return slatejsx(
        "element",
        {
          type: TYPE_COMMENT_INLINE,
          data: embedAttributes,
        },
        children,
      );
    }
  },
  serialize(node, children) {
    if (!Element.isElement(node) || node.type !== TYPE_COMMENT_INLINE || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true, children });
  },
};

export const commentInlinePlugin = (editor: Editor) => {
  const { isInline: nextIsInline, normalizeNode: nextNormalizeNode } = editor;

  editor.isInline = (element: Element) => {
    if (element.type === TYPE_COMMENT_INLINE) {
      return true;
    }
    return nextIsInline(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Element.isElement(node)) {
      if (node.type === TYPE_COMMENT_INLINE) {
        if (Node.string(node) === "") {
          return Transforms.removeNodes(editor, { at: path });
        }
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
