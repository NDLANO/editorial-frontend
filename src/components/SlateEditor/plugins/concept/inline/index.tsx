/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Node, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_CONCEPT_INLINE } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../../interfaces";
import { TYPE_NDLA_EMBED } from "../../embed/types";

export const inlineConceptSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource === "concept" && embedAttributes.type === "inline") {
      return slatejsx(
        "element",
        {
          type: TYPE_CONCEPT_INLINE,
          data: embedAttributes,
        },
        [
          {
            text: embedAttributes.linkText ? embedAttributes.linkText : "Ukjent forklaringstekst",
          },
        ],
      );
    }
  },
  serialize(node) {
    if (!Element.isElement(node) || node.type !== TYPE_CONCEPT_INLINE) return;
    const data = createDataAttributes({ ...node.data, linkText: Node.string(node) });
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
};

export const inlineConceptPlugin = (editor: Editor) => {
  const { isInline: nextIsInline, normalizeNode: nextNormalizeNode } = editor;

  editor.isInline = (element: Element) => {
    if (element.type === TYPE_CONCEPT_INLINE) {
      return true;
    }
    return nextIsInline(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Element.isElement(node)) {
      if (node.type === TYPE_CONCEPT_INLINE) {
        if (Node.string(node) === "") {
          return Transforms.removeNodes(editor, { at: path });
        }
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
