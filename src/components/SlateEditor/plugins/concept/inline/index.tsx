/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Node, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_CONCEPT_INLINE } from "./types";
import { createEmbedTagV2, reduceElementDataAttributesV2 } from "../../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../../interfaces";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import { TYPE_NDLA_EMBED } from "../../embed/types";

export const inlineConceptSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes));
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
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_CONCEPT_INLINE) return;

    const data = {
      ...node.data,
      linkText: Node.string(node),
    };

    return createEmbedTagV2(data, undefined, undefined);
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
