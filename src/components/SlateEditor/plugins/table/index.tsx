/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import equals from "lodash/fp/equals";
import { renderToStaticMarkup } from "react-dom/server";
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
import { handleTableKeydown, onDelete, onDown, onEnter, onTab, onUp } from "./handleKeyDown";
import { TableElement } from "./interfaces";
import { getTableAsMatrix, tableContainsSpan } from "./matrix";
import { getHeader, previousMatrixCellIsEqualCurrent, setHeadersOnCell } from "./matrixHelpers";
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
import { reduceElementDataAttributes, removeEmptyElementDataAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { NormalizerConfig, defaultBlockNormalizer } from "../../utils/defaultNormalizer";
import getCurrentBlock from "../../utils/getCurrentBlock";
import { KEY_ARROW_DOWN, KEY_ARROW_UP, KEY_BACKSPACE, KEY_DELETE, KEY_ENTER, KEY_TAB } from "../../utils/keys";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { defaultParagraphBlock } from "../paragraph/utils";
import { createPluginFactory } from "../PluginFactory";

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
      const filter = ["rowspan", "colspan", "align", "valign", "class", "scope", "id", "headers"];
      const attrs = reduceElementDataAttributes(el, filter);
      const colspan = attrs.colspan && parseInt(attrs.colspan);
      const rowspan = attrs.rowspan && parseInt(attrs.rowspan);
      const data = {
        ...attrs,
        colspan: colspan || 1,
        rowspan: rowspan || 1,
      };
      if (equals(children, [{ text: "" }])) {
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
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;

    if (node.type === TYPE_TABLE_HEAD) {
      return <thead>{children}</thead>;
    }

    if (node.type === TYPE_TABLE_BODY) {
      return <tbody>{children}</tbody>;
    }

    if (node.type === TYPE_TABLE_CAPTION) {
      if (Node.string(node) === "") {
        return <></>;
      }
      return <caption>{children}</caption>;
    }
    if (node.type === TYPE_TABLE) {
      const [caption, ...rest] = children;
      if (caption.type === "caption") {
        return (
          <table
            dangerouslySetInnerHTML={{
              __html:
                renderToStaticMarkup(caption) + node.colgroups + rest.map((e) => renderToStaticMarkup(e)).join(""),
            }}
          ></table>
        );
      }
      return (
        <table
          dangerouslySetInnerHTML={{
            __html: node.colgroups + children.map((e) => renderToStaticMarkup(e)).join(""),
          }}
        ></table>
      );
    }
    if (node.type === TYPE_TABLE_ROW) {
      return <tr>{children}</tr>;
    }
    if (node.type === TYPE_TABLE_CELL || node.type === TYPE_TABLE_CELL_HEADER) {
      const data = node.data;
      const props = removeEmptyElementDataAttributes({ ...data });

      // There is no need in saving colspan and rowspan = 1.
      // Undefined gives the same result in html-rendering
      if (data.colspan === 1) {
        delete props.colspan;
      }
      if (data.rowspan === 1) {
        delete props.rowspan;
      }

      if (node.type === TYPE_TABLE_CELL_HEADER) {
        return (
          <th {...props} scope={node.data.scope}>
            {children}
          </th>
        );
      }
      return <td {...props}>{children}</td>;
    }
  },
};

export const tablePlugin = createPluginFactory<TableElement>({
  type: TYPE_TABLE,
  onKeyDown: {
    [KEY_ENTER]: onEnter,
    [KEY_ARROW_DOWN]: onDown,
    [KEY_ARROW_UP]: onUp,
    [KEY_DELETE]: onDelete,
    [KEY_TAB]: onTab,
  },
  normalizerConfig: normalizerConfig,
  normalize: [
    {
      description: "First item bust be caption",
      normalize: ([node, path], editor) => {
        if (isTable(node)) {
          if (!isTableCaption(node.children[0])) {
            Transforms.insertNodes(editor, defaultTableCaptionBlock(), {
              at: [...path, 0],
            });
            return true;
          }
        }
        return false;
      },
    },
    {
      description: "Second item must be tableHead or tableBody",
      normalize: ([node, path], editor) => {
        if (isTable(node)) {
          if (!isTableHead(node.children[1]) && !isTableBody(node.children[1])) {
            Transforms.insertNodes(editor, defaultTableHeadBlock(0), {
              at: [...path, 1],
            });
            return true;
          }
        }
        return false;
      },
    },
    {
      description: "Make sure table contains the correct nodes",
      normalize: ([node, path], editor) => {
        for (const [index, child] of node.children.entries()) {
          // Caption can't be placed at any other index than 0. Otherwise: Remote it.
          if (index !== 0 && isTableCaption(child)) {
            Transforms.removeNodes(editor, { at: [...path, index] });
            return true;
          }

          // Consecutive items must be tableBody. Otherwise: Wrap as tableBody.
          if (index === 1 && !isTableHead(child) && !isTableBody(child)) {
            Transforms.wrapNodes(editor, defaultTableBodyBlock(1, 0), {
              at: [...path, index],
            });
            return true;
          }
        }
        return false;
      },
    },
    {
      description: "Make sure head and body have same length",
      normalize: ([node, path], editor) => {
        for (const [index, child] of node.children.entries()) {
          if (isTableHead(child) || isTableBody(child)) {
            return normalizeTableBodyAsMatrix(editor, child, [...path, index]);
          }
        }
        return false;
      },
    },
    {
      description: "Assure headers and id elements are set on tables",
      normalize: ([node, path], editor) => {
        const matrix = getTableAsMatrix(editor, path);
        if (
          matrix &&
          (tableContainsSpan(matrix ?? []) || node.rowHeaders || matrix?.[1]?.[1]?.type === TYPE_TABLE_CELL_HEADER)
        ) {
          return setHeadersOnCell(matrix, node, path, editor);
        }
        return false;
      },
    },
  ],
  childPlugins: [
    {
      type: TYPE_TABLE_CELL,
      normalize: [
        {
          description: "",
          normalize: ([node, path], editor) => {
            if (isTableCell(node)) {
              if (!Element.isElementList(node.children)) {
                Transforms.wrapNodes(
                  editor,
                  { ...defaultParagraphBlock(), serializeAsText: true },
                  {
                    at: path,
                    match: (n) => n !== node,
                  },
                );
                return true;
              }
            }
            return false;
          },
        },
      ],
    },
    {
      type: TYPE_TABLE_ROW,
      normalize: [
        {
          description: "row should only contain cell elements",
          normalize: ([node, path], editor) => {
            for (const [index, cell] of node.children.entries()) {
              if (!isTableCell(cell)) {
                Transforms.wrapNodes(editor, defaultTableCellBlock(), {
                  at: [...path, index],
                });
                return true;
              }
            }
            return false;
          },
        },
      ],
    },
  ],
});

export const tablePlugin = (editor: Editor) => {
  const { normalizeNode, onKeyDown } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

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
    if (isTableCell(node)) {
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
        return handleTableKeydown(event, editor);
      }
    }
    // Prevent enter from functioning in caption
    if (event.key === KEY_ENTER) {
    }
    onKeyDown?.(event);
  };

  return editor;
};
