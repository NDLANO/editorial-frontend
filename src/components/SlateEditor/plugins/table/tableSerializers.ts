/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { createHtmlTag, createSerializer, isElementOfType, parseElementAttributes } from "@ndla/editor";
import {
  TABLE_BODY_ELEMENT_TYPE,
  TABLE_CAPTION_ELEMENT_TYPE,
  TABLE_ELEMENT_TYPE,
  TABLE_HEAD_ELEMENT_TYPE,
  TABLE_ROW_ELEMENT_TYPE,
} from "./types";
import { isEqual } from "lodash-es";
import { defaultParagraphBlock } from "../paragraph/utils";
import {
  isTableBodyElement,
  isTableCaptionElement,
  isTableCellElement,
  isTableCellHeaderElement,
  isTableElement,
  isTableHeadElement,
  isTableRowElement,
} from "./queries";
import { Node } from "slate";

const TABLE_TAGS = {
  th: "table-cell-header",
  td: "table-cell",
};

const TABLE_CAPTION_REGEXP = /(<caption\b[^>]*>[\s\S]*?<\/caption>)/i;

// This uses regex parsing to be compatible with node, if we ever choose to do server-side serialization
// instead of client-side.
const extractTableCaption = (html: string) => {
  // Extract the caption including its tags
  const captionMatch = html.match(TABLE_CAPTION_REGEXP);
  const caption = captionMatch ? captionMatch[1].trim() : undefined;

  // Remove the caption from the table
  const tableWithoutCaption = html.replace(TABLE_CAPTION_REGEXP, "").trim();

  return { caption, tableContent: tableWithoutCaption };
};

export const tableSerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "table") return;
    const rowHeaders = !!el.querySelector("tbody th");
    const childNodes = Array.from(el.childNodes) as HTMLElement[];

    // Colgroup and col is removed from the table when in the editor due to normalization.
    // We append the colgroup into the html in the serialization.
    const colgroups =
      childNodes
        .filter((child) => ["colgroup", "col"].includes((child as HTMLElement).tagName?.toLowerCase()))
        .map((col) => col.outerHTML)
        .join("") || "";

    return slatejsx(
      "element",
      {
        type: TABLE_ELEMENT_TYPE,
        colgroups,
        rowHeaders,
      },
      // We ensure the children of of the table only includes the wrapper elements and not direct table rows or cells.
      children.filter((child) =>
        isElementOfType(child, [TABLE_HEAD_ELEMENT_TYPE, TABLE_BODY_ELEMENT_TYPE, TABLE_CAPTION_ELEMENT_TYPE]),
      ),
    );
  },
  serialize: (node, children) => {
    if (!isTableElement(node)) return;
    const { caption, tableContent } = children ? extractTableCaption(children) : {};
    const tableElements = [caption, node.colgroups, tableContent].filter((el) => el);
    const modifiedChildren = tableElements.length ? tableElements.join("") : children;
    return createHtmlTag({ tag: "table", children: modifiedChildren });
  },
});

export const tableRowSerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "tr") return;
    return slatejsx("element", { type: TABLE_ROW_ELEMENT_TYPE }, children);
  },
  serialize: (node, children) => {
    if (!isTableRowElement(node)) return;
    return createHtmlTag({ tag: "tr", children });
  },
});

export const tableCaptionSerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "caption") return;
    return slatejsx("element", { type: TABLE_CAPTION_ELEMENT_TYPE }, children);
  },
  serialize: (node, children) => {
    if (!isTableCaptionElement(node)) return;
    if (Node.string(node) === "") return undefined;
    return createHtmlTag({ tag: "caption", children });
  },
});

export const tableHeadSerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "thead") return;
    return slatejsx("element", { type: TABLE_HEAD_ELEMENT_TYPE }, children);
  },
  serialize: (node, children) => {
    if (!isTableHeadElement(node)) return;
    return createHtmlTag({ tag: "thead", children });
  },
});

export const tableBodySerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "tbody") return;
    return slatejsx("element", { type: TABLE_BODY_ELEMENT_TYPE }, children);
  },
  serialize: (node, children) => {
    if (!isTableBodyElement(node)) return;
    return createHtmlTag({ tag: "tbody", children });
  },
});

const TAG_ATTRIBUTE_FILTER = ["rowspan", "colspan", "data-align", "class", "id", "headers"];

const EMPTY_TEXT_CHILDREN = [{ text: "" }];

export const tableCellSerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "td") return;
    const attrs = parseElementAttributes(Array.from(el.attributes), TAG_ATTRIBUTE_FILTER);
    const colspan = attrs.colspan && parseInt(attrs.colspan);
    const rowspan = attrs.rowspan && parseInt(attrs.rowspan);
    const data = {
      ...attrs,
      colspan: colspan || 1,
      rowspan: rowspan || 1,
    };
    if (isEqual(children, EMPTY_TEXT_CHILDREN)) {
      children = [{ ...defaultParagraphBlock(), serializeAsText: true }];
    }
    return slatejsx("element", { type: TABLE_TAGS.td, data: data }, children);
  },
  serialize: (node, children) => {
    if (!isTableCellElement(node)) return;
    return createHtmlTag({
      tag: "td",
      data: {
        rowSpan: node.data.rowspan !== 1 ? node.data.rowspan : undefined,
        colSpan: node.data.colspan !== 1 ? node.data.colspan : undefined,
        className: node.data.class,
        headers: node.data.headers,
        id: node.data.id,
        "data-align": node.data.align,
      },
      children,
    });
  },
});

export const tableHeaderSerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "th") return;
    const attrs = parseElementAttributes(Array.from(el.attributes), TAG_ATTRIBUTE_FILTER.concat("scope"));
    const colspan = attrs.colspan && parseInt(attrs.colspan);
    const rowspan = attrs.rowspan && parseInt(attrs.rowspan);
    const data = {
      ...attrs,
      colspan: colspan || 1,
      rowspan: rowspan || 1,
    };
    if (isEqual(children, EMPTY_TEXT_CHILDREN)) {
      children = [{ ...defaultParagraphBlock(), serializeAsText: true }];
    }
    return slatejsx("element", { type: TABLE_TAGS.th, data: data }, children);
  },
  serialize: (node, children) => {
    if (!isTableCellHeaderElement(node)) return;
    return createHtmlTag({
      tag: "th",
      data: {
        rowSpan: node.data.rowspan !== 1 ? node.data.rowspan : undefined,
        colSpan: node.data.colspan !== 1 ? node.data.colspan : undefined,
        className: node.data.class,
        headers: node.data.headers,
        scope: node.data.scope,
        id: node.data.id,
        "data-align": node.data.align,
      },
      children,
    });
  },
});
