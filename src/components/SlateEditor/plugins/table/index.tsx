/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEqual } from "lodash-es";
import { Descendant, Editor, Element, Node, NodeEntry, Path, Text, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { jsx as slatejsx } from "slate-hyperscript";
import {
  defaultTableBodyBlock,
  defaultTableCaptionBlock,
  defaultTableCellBlock,
  defaultTableHeadBlock,
  defaultTableRowBlock,
} from "./defaultBlocks";
import { handleTableKeydown } from "./handleKeyDown";
import { TableElement } from "./interfaces";
import { getTableAsMatrix } from "./matrix";
import { getHeader, getId, previousMatrixCellIsEqualCurrent } from "./matrixHelpers";
import { normalizeTableBodyAsMatrix } from "./matrixNormalizer";
import { updateCell } from "./slateActions";
import {
  isTable,
  isTableBody,
  isTableCaption,
  isTableCell,
  isTableCellHeader,
  isTableHead,
  isTableRow,
} from "./slateHelpers";
import {
  TYPE_TABLE,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_BODY,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE_ROW,
  TYPE_TABLE_CELL,
  TYPE_TABLE_CELL_HEADER,
} from "./types";
import { createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { NormalizerConfig, defaultBlockNormalizer } from "../../utils/defaultNormalizer";
import getCurrentBlock from "../../utils/getCurrentBlock";
import { KEY_ARROW_DOWN, KEY_ARROW_UP, KEY_BACKSPACE, KEY_DELETE, KEY_ENTER, KEY_TAB } from "../../utils/keys";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { defaultParagraphBlock } from "../paragraph/utils";

const validKeys = [KEY_ARROW_UP, KEY_ARROW_DOWN, KEY_TAB, KEY_BACKSPACE, KEY_DELETE];

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
};

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

export const tableSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    const tagName = el.tagName.toLowerCase();

    if (tagName === "table") {
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
          type: TYPE_TABLE,
          colgroups,
          rowHeaders,
        },
        // We ensure the children of of the table only includes the wrapper elements and not direct table rows or cells.
        children.filter(
          (child) =>
            Element.isElement(child) && [TYPE_TABLE_HEAD, TYPE_TABLE_BODY, TYPE_TABLE_CAPTION].includes(child.type),
        ),
      );
    }
    if (tagName === "tr") {
      return slatejsx("element", { type: TYPE_TABLE_ROW }, children);
    }

    if (tagName === "caption") {
      return slatejsx("element", { type: TYPE_TABLE_CAPTION }, children);
    }

    if (tagName === "thead") {
      return slatejsx("element", { type: TYPE_TABLE_HEAD }, children);
    }

    if (tagName === "tbody") {
      return slatejsx("element", { type: TYPE_TABLE_BODY }, children);
    }
    // We treat th and td the same as they're both cell elements. Ensuring they both have the same formatting options/data object
    if (tagName === "th" || tagName === "td") {
      const filter = ["rowspan", "colspan", "data-align", "class", "id", "headers"];

      if (tagName === "th") {
        filter.push("scope");
      }

      const attrs = parseElementAttributes(Array.from(el.attributes), filter);
      const colspan = attrs.colspan && parseInt(attrs.colspan);
      const rowspan = attrs.rowspan && parseInt(attrs.rowspan);
      const data = {
        ...attrs,
        colspan: colspan || 1,
        rowspan: rowspan || 1,
      };
      if (isEqual(children, [{ text: "" }])) {
        children = [
          {
            ...defaultParagraphBlock(),
            serializeAsText: true,
          },
        ];
      }
      return slatejsx("element", { type: TABLE_TAGS[tagName], data: data }, children);
    }
    return;
  },
  serialize(node, children) {
    if (!Element.isElement(node)) return;

    if (node.type === TYPE_TABLE_HEAD) {
      return createHtmlTag({ tag: "thead", children });
    }

    if (node.type === TYPE_TABLE_BODY) {
      return createHtmlTag({ tag: "tbody", children });
    }

    if (node.type === TYPE_TABLE_CAPTION) {
      if (Node.string(node) === "") {
        return undefined;
      }
      return createHtmlTag({ tag: "caption", children });
    }
    if (node.type === TYPE_TABLE) {
      const { caption, tableContent } = children ? extractTableCaption(children) : {};
      const tableElements = [caption, node.colgroups, tableContent].filter((el) => el);
      const modifiedChildren = tableElements.length ? tableElements.join("") : children;
      return createHtmlTag({ tag: "table", children: modifiedChildren });
    }
    if (node.type === TYPE_TABLE_ROW) {
      return createHtmlTag({ tag: "tr", children });
    }

    if (node.type === TYPE_TABLE_CELL) {
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
    }
    if (node.type === TYPE_TABLE_CELL_HEADER) {
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
    }
  },
};

export const tablePlugin = (editor: Editor) => {
  const { normalizeNode, onKeyDown } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    // A. Table normalizer
    if (isTable(node)) {
      const tableChildren = node.children;

      // i. First item must be a caption. Otherwise: Insert one.
      if (!isTableCaption(tableChildren[0])) {
        return Transforms.insertNodes(editor, defaultTableCaptionBlock(), {
          at: [...path, 0],
        });
      }

      // ii. Second item must be tableHead or tableBody. Otherwise: Insert tableHead.
      if (!isTableHead(tableChildren[1]) && !isTableBody(tableChildren[1])) {
        return Transforms.insertNodes(editor, defaultTableHeadBlock(0), {
          at: [...path, 1],
        });
      }

      // iii. Make sure table contains the correct caption, tableHead and tableBody nodes.
      for (const [index, child] of node.children.entries()) {
        // Caption can't be placed at any other index than 0. Otherwise: Remote it.
        if (index !== 0 && isTableCaption(child)) {
          return Transforms.removeNodes(editor, { at: [...path, index] });
        }

        // Consecutive items must be tableBody. Otherwise: Wrap as tableBody.
        if (index === 1 && !isTableHead(child) && !isTableBody(child)) {
          return Transforms.wrapNodes(editor, defaultTableBodyBlock(1, 0), {
            at: [...path, index],
          });
        }
      }

      // iv. Normalize each tableBody using matrix convertion for help.
      for (const [index, child] of node.children.entries()) {
        if (isTableHead(child) || isTableBody(child)) {
          if (normalizeTableBodyAsMatrix(editor, child, [...path, index])) {
            return;
          }
        }
      }
      // v. Add surrounding paragraphs. Must be last since the table itself is not altered.
      if (defaultBlockNormalizer(editor, node, path, normalizerConfig)) {
        return;
      }

      // Normalize headers and id. For each row check that id and headers are set accordingly.
      // We have a maximum of rows of header elements in thead and only 1 column max for rowheaders
      const matrix = getTableAsMatrix(editor, path);

      const tableHeadRows = Array.from(
        editor.nodes({
          match: isTableHead,
          at: path,
        }),
      ).flatMap(([node]) => node.children);

      const containsSpans = !!editor
        .nodes({ match: (n) => isTableCell(n) && (n.data.colspan > 1 || n.data.rowspan > 1), at: path })
        .next().value;

      const headerCellsInMultipleRows = tableHeadRows.length === 2 || (tableHeadRows.length >= 1 && node.rowHeaders);

      // Should only have headers if a cell is associated with 2 or more header cells.
      const shouldHaveHeaders = containsSpans || headerCellsInMultipleRows;
      if (shouldHaveHeaders) {
        return editor.withoutNormalizing(() => {
          matrix?.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
              const [maybeNode] = Editor.nodes(editor, {
                at: path,
                match: (node) => isEqual(node, cell),
              });

              // If the previous cell in column and row direction is not equal we can normalize the proper cell.
              // Table matrix isn't a direct repsentation of the HTML table so read comments for `getTableAsMatrix`
              if (!previousMatrixCellIsEqualCurrent(matrix, rowIndex, cellIndex) && maybeNode) {
                const [_, cellPath] = maybeNode as NodeEntry<TableElement>;
                const [parent] = Editor.node(editor, Path.parent(Path.parent(cellPath)));

                const isBody = isTableBody(parent);

                const headers = getHeader(matrix, rowIndex, cellIndex, node.rowHeaders);
                const id = getId(matrix, rowIndex, cellIndex, isBody);

                if (id !== cell.data.id || headers !== cell.data.headers) {
                  updateCell(editor, cell, { id: id, headers: headers }, TYPE_TABLE_CELL_HEADER);
                }
              }
            });
          });
        });
      }

      const containsIdOrHeaders = !!editor
        .nodes({ match: (n) => isTableCell(n) && (!!n.data.id || !!n.data.headers), at: path })
        .next().value;

      // Only remove headers if cell is only associated with 1 cell and there is cells with Id and headers in the table
      const shouldRemoveHeaders = !shouldHaveHeaders && containsIdOrHeaders;

      if (shouldRemoveHeaders && containsIdOrHeaders) {
        return editor.withoutNormalizing(() => {
          matrix?.forEach((row) => {
            row.forEach((cell) => {
              if (cell.data.id || cell.data.headers) {
                updateCell(editor, cell, { id: undefined, headers: undefined });
              }
            });
          });
        });
      }
    }

    // B. TableHead and TableBody normalizer
    if (isTableHead(node) || isTableBody(node)) {
      const bodyNodes = node.children;

      // If head or body contains non-row element, wrap it in row element
      for (const [index, child] of bodyNodes.entries()) {
        if (!Element.isElement(child) || child.type !== TYPE_TABLE_ROW) {
          return Transforms.wrapNodes(editor, defaultTableRowBlock(0), {
            at: [...path, index],
          });
        }
      }
    }

    // C. TableCell normalizer
    if (isTableCell(node) || isTableCellHeader(node)) {
      // Cells should only contain elements. If not, wrap content in paragraph
      if (!Element.isElementList(node.children)) {
        return Transforms.wrapNodes(
          editor,
          { ...defaultParagraphBlock(), serializeAsText: true },
          {
            at: path,
            match: (n) => n !== node,
          },
        );
      }

      // Numbers need to be right aligned default
      if (!isNaN(Number(Node.string(node))) && !node.data?.align && Node.string(node) !== "") {
        return HistoryEditor.withoutSaving(editor, () => updateCell(editor, node, { align: "right" }));
      }
    }

    // D. TableRow normalizer
    if (isTableRow(node)) {
      // i. Row should only contain cell elements. If not, wrap element in cell
      for (const [index, cell] of node.children.entries()) {
        if (!isTableCell(cell)) {
          return Transforms.wrapNodes(editor, defaultTableCellBlock(), {
            at: [...path, index],
          });
        }
      }

      const [body, bodyPath] = Editor.node(editor, Path.parent(path));
      const [table] = Editor.node(editor, Path.parent(bodyPath));

      // ii. Make sure cells in TableHead are set to TYPE_TABLE_CELL_HEADER.
      //     Cells in TableBody will not be altered if rowHeaders=true on Table.
      if (isTableHead(body) && isTable(table)) {
        for (const [, cell] of node.children.entries()) {
          if (isTableCell(cell) && cell.type !== TYPE_TABLE_CELL_HEADER) {
            return HistoryEditor.withoutSaving(editor, () => {
              updateCell(
                editor,
                cell,
                {
                  scope: "col",
                },
                TYPE_TABLE_CELL_HEADER,
              );
            });
          }
        }
      }
    }

    // E. TableCaption normalizer
    if (isTableCaption(node)) {
      for (const [index, child] of node.children.entries()) {
        // i. Unwrap if not text
        if (!Text.isText(child)) {
          return Transforms.unwrapNodes(editor, {
            at: [...path, index],
          });
          // ii. Remove styling on text
        } else if (child.bold || child.code || child.italic || child.sub || child.sup || child.underlined) {
          Transforms.unsetNodes(editor, ["bold", "code", "italic", "sub", "sup", "underlined"], {
            at: path,
            match: (node) => Text.isText(node),
          });
          return;
        }
      }
    }

    normalizeNode(entry);
  };

  editor.onKeyDown = (event) => {
    // Navigation with arrows and tab
    if (validKeys.includes(event.key)) {
      const entry = getCurrentBlock(editor, TYPE_TABLE);
      if (!entry) {
        return onKeyDown?.(event);
      }
      const [tableNode, tablePath] = entry;

      if (tablePath && tableNode && editor.selection && Path.isDescendant(editor.selection.anchor.path, tablePath)) {
        if (tableNode) {
          return handleTableKeydown(event, editor, [tableNode, tablePath] as NodeEntry<TableElement>);
        }
      }
    }
    // Prevent enter from functioning in caption
    if (event.key === KEY_ENTER) {
      const entry = getCurrentBlock(editor, TYPE_TABLE_CAPTION);
      if (!entry) {
        return onKeyDown?.(event);
      }
      const [captionNode] = entry;

      if (captionNode) {
        return event.preventDefault();
      }
    }
    onKeyDown?.(event);
  };

  return editor;
};
