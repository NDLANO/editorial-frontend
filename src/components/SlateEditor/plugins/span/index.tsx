/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEmpty from "lodash/isEmpty";
import { Descendant, Editor, Element, Node, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { NOOP_ELEMENT_TYPE } from "@ndla/editor";
import { TYPE_SPAN } from "./types";
import { createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { TYPE_QUOTE } from "../blockquote/types";
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_TERM } from "../definitionList/types";
import { TYPE_SUMMARY } from "../details/types";
import { TYPE_HEADING } from "../heading/types";

import { TYPE_LIST_ITEM } from "../list/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { TYPE_TABLE_CELL } from "../table/types";

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
      TYPE_HEADING,
      TYPE_PARAGRAPH,
      TYPE_QUOTE,
      TYPE_TABLE_CELL,
      TYPE_LIST_ITEM,
      TYPE_DEFINITION_TERM,
      TYPE_DEFINITION_DESCRIPTION,
      TYPE_SUMMARY,
      TYPE_SPAN,
      NOOP_ELEMENT_TYPE,
    ],
  },
};

export const spanSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== "span") return;
    const attributes = parseElementAttributes(Array.from(el.attributes));

    if (isEmpty(attributes)) return;

    return slatejsx("element", { type: TYPE_SPAN, data: attributes }, children);
  },
  serialize(node, children) {
    if (!Element.isElement(node) || node.type !== TYPE_SPAN) return;
    if (!Object.keys(node.data ?? {}).length) {
      return children;
    }

    return createHtmlTag({ tag: TYPE_SPAN, data: node.data, children });
  },
};

export const spanPlugin = (editor: Editor) => {
  const { isInline: nextIsInline, normalizeNode } = editor;

  editor.isInline = (element) => {
    if (element.type === TYPE_SPAN) {
      return true;
    }
    return nextIsInline(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_SPAN) {
      if (Node.string(node) === "") {
        return Transforms.removeNodes(editor, { at: path });
      }

      if (defaultBlockNormalizer(editor, node, path, normalizerConfig)) {
        return;
      }
    }

    normalizeNode(entry);
  };

  return editor;
};
