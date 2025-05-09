/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  parseElementAttributes,
} from "@ndla/editor";
import { isConceptInlineElement } from "./queries";
import { CONCEPT_INLINE_ELEMENT_TYPE, CONCEPT_INLINE_PLUGIN } from "./types";
import { TYPE_NDLA_EMBED } from "../../embed/types";

export const inlineConceptSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource === "concept" && embedAttributes.type === "inline") {
      return slatejsx(
        "element",
        {
          type: CONCEPT_INLINE_ELEMENT_TYPE,
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
    if (!isConceptInlineElement(node)) return;
    const data = createDataAttributes({ ...node.data, linkText: Node.string(node) });
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});

export const inlineConceptPlugin = createPlugin({
  name: CONCEPT_INLINE_PLUGIN,
  type: CONCEPT_INLINE_ELEMENT_TYPE,
  isInline: true,
  normalize: (editor, node, path, logger) => {
    if (!isConceptInlineElement(node)) return false;
    if (Node.string(node) === "") {
      logger.log("Encountered empty concept inline element, removing");
      Transforms.removeNodes(editor, { at: path });
      return true;
    }
    return false;
  },
});
