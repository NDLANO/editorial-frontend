/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createHtmlTag,
  createPlugin,
  createSerializer,
  defaultNormalizer,
  HEADING_ELEMENT_TYPE,
  LIST_ITEM_ELEMENT_TYPE,
  NOOP_ELEMENT_TYPE,
  NormalizerConfig,
  PARAGRAPH_ELEMENT_TYPE,
  parseElementAttributes,
} from "@ndla/editor";
import { isEmpty } from "lodash-es";
import { Descendant, Node, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../blockquote/blockquoteTypes";
import { CONCEPT_INLINE_ELEMENT_TYPE } from "../concept/inline/types";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "../definitionList/definitionListTypes";
import { TABLE_CELL_ELEMENT_TYPE } from "../table/types";
import { isSpanElement } from "./queries";
import { SPAN_ELEMENT_TYPE, SPAN_PLUGIN } from "./types";

export interface SpanElement {
  type: "span";
  data: {
    lang?: string;
    dir?: string;
    "data-size"?: string;
  };
  children: Descendant[];
}

const normalizerConfig: NormalizerConfig = {
  parent: {
    allowed: [
      HEADING_ELEMENT_TYPE,
      PARAGRAPH_ELEMENT_TYPE,
      BLOCK_QUOTE_ELEMENT_TYPE,
      TABLE_CELL_ELEMENT_TYPE,
      LIST_ITEM_ELEMENT_TYPE,
      DEFINITION_DESCRIPTION_ELEMENT_TYPE,
      DEFINITION_TERM_ELEMENT_TYPE,
      CONCEPT_INLINE_ELEMENT_TYPE,
      SPAN_ELEMENT_TYPE,
      NOOP_ELEMENT_TYPE,
    ],
  },
};

export const spanSerializer = createSerializer({
  deserialize(el, children) {
    if (el.tagName.toLowerCase() !== "span") return;
    const attributes = parseElementAttributes(Array.from(el.attributes));

    if (isEmpty(attributes)) return;

    return slatejsx("element", { type: SPAN_ELEMENT_TYPE, data: attributes }, children);
  },
  serialize(node, children) {
    if (!isSpanElement(node)) return;
    if (!Object.keys(node.data ?? {}).length) {
      return children;
    }

    return createHtmlTag({ tag: SPAN_ELEMENT_TYPE, data: node.data, children });
  },
});

export const spanPlugin = createPlugin({
  name: SPAN_PLUGIN,
  type: SPAN_ELEMENT_TYPE,
  isInline: true,
  normalize: (editor, node, path, logger) => {
    if (isSpanElement(node)) {
      if (Node.string(node) === "") {
        logger.log("Removing empty span");
        Transforms.removeNodes(editor, { at: path });
        return true;
      }
      return defaultNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
