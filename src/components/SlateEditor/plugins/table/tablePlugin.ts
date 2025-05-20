/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createPlugin,
  defaultNormalizer,
  getCurrentBlock,
  NormalizerConfig,
  PARAGRAPH_ELEMENT_TYPE,
} from "@ndla/editor";
import { TABLE_CELL_HEADER_ELEMENT_TYPE, TABLE_ELEMENT_TYPE, TABLE_PLUGIN } from "./types";
import {
  isAnyTableCellElement,
  isTableBodyElement,
  isTableCaptionElement,
  isTableElement,
  isTableHeadElement,
  isTableRowElement,
  isTableSectionElement,
} from "./queries";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { Editor, NodeEntry, Path, Point, Range, Transforms } from "slate";
import { defaultTableCaptionBlock, defaultTableHeadBlock } from "./defaultBlocks";
import { getTableAsMatrix } from "./matrix";
import isEqual from "lodash-es/isEqual";
import { getHeader, getId, previousMatrixCellIsEqualCurrent } from "./matrixHelpers";
import { TableElement } from "./interfaces";
import { updateCell } from "./slateActions";
import { normalizeTableSectionAsMatrix } from "./matrixNormalizer";
import { isKeyHotkey } from "is-hotkey";
import { KEY_ARROW_DOWN, KEY_ARROW_UP, KEY_BACKSPACE, KEY_DELETE } from "../../utils/keys";
import { moveDown, moveLeft, moveRight, moveUp } from "./handleKeyDown";

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const tablePlugin = createPlugin({
  name: TABLE_PLUGIN,
  type: TABLE_ELEMENT_TYPE,
  shortcuts: {
    onArrow: {
      keyCondition: isKeyHotkey([KEY_ARROW_DOWN, KEY_ARROW_UP]),
      handler: (editor, event, logger) => {
        if (!editor.selection) return false;
        const entry = getCurrentBlock(editor, TABLE_ELEMENT_TYPE);
        if (!entry) return false;
        const [cell] = editor.nodes({ at: editor.selection.anchor.path, match: isAnyTableCellElement });
        if (!cell) return false;
        event.preventDefault();
        const move = event.key === KEY_ARROW_DOWN ? moveDown : moveUp;
        move(editor, entry, cell, logger);
        return true;
      },
    },
    onTab: {
      keyCondition: isKeyHotkey("shift?+tab"),
      handler: (editor, event, logger) => {
        if (!editor.selection) return false;
        const entry = getCurrentBlock(editor, TABLE_ELEMENT_TYPE);
        if (!entry) return false;
        const [row] = editor.nodes({ at: editor.selection.anchor.path, match: isTableRowElement });
        if (!row) return false;
        const [section] = editor.nodes({ at: editor.selection.anchor.path, match: isTableSectionElement });
        if (!section) return false;
        const [cell] = editor.nodes({ at: editor.selection.anchor.path, match: isAnyTableCellElement });
        if (!cell) return false;
        const move = event.shiftKey ? moveLeft : moveRight;
        event.preventDefault();
        move(editor, entry, section, row, cell, logger);
        return true;
      },
    },
    onDelete: {
      keyCondition: isKeyHotkey([KEY_DELETE, KEY_BACKSPACE]),
      handler: (editor, event, logger) => {
        if (!editor.selection || Range.isExpanded(editor.selection)) return false;
        const [cell] = editor.nodes({ at: editor.selection.anchor.path, match: isAnyTableCellElement });
        if (!cell) return false;
        const edge = event.key === KEY_DELETE ? "end" : "start";
        const edgePoint = editor.point(cell[1], { edge: event.key === KEY_DELETE ? "end" : "start" });
        if (Point.equals(editor.selection.anchor, edgePoint)) {
          logger.log(`Pressed ${event.key} at ${edge} of cell. Preventing.`);
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  },
  normalize: (editor, node, path, logger) => {
    if (!isTableElement(node)) return false;
    if (!isTableCaptionElement(node.children[0])) {
      logger.log("Table does not have a caption. Inserting default caption.");
      Transforms.insertNodes(editor, defaultTableCaptionBlock(), { at: path.concat(0) });
      return true;
    }
    if (defaultNormalizer(editor, node, path, normalizerConfig, logger)) return true;
    const [, secondChild] = node.children;
    if (!isTableSectionElement(secondChild)) {
      logger.log(
        "Second table child is neither a table head nor a table body. Inserting table head.",
        node.children,
        secondChild,
      );
      Transforms.insertNodes(editor, defaultTableHeadBlock(0), { at: path.concat(1) });
      return true;
    }

    // TODO: I realllllly don't want to have this here. It really should be on head and body, but that breaks stuff. We'll figure it out once we refactor the matrix normalizer.
    for (const [index, child] of node.children.entries()) {
      if (isTableSectionElement(child)) {
        if (normalizeTableSectionAsMatrix(editor, child, path.concat(index))) {
          return true;
        }
      }
    }

    // TODO: A whole lot of stuff :')

    // Normalize headers and id. For each row check that id and headers are set accordingly.
    // We have a maximum of rows of header elements in thead and only 1 column max for rowheaders
    const matrix = getTableAsMatrix(editor, path);

    const tableHeadRows = Array.from(editor.nodes({ match: isTableHeadElement, at: path })).flatMap(
      ([node]) => node.children,
    );

    const containsSpans = !!editor
      .nodes({ match: (n) => isAnyTableCellElement(n) && (n.data.colspan > 1 || n.data.rowspan > 1), at: path })
      .next().value;

    const headerCellsInMultipleRows = tableHeadRows.length === 2 || (tableHeadRows.length >= 1 && node.rowHeaders);

    // Should only have headers if a cell is associated with 2 or more header cells.
    const shouldHaveHeaders = containsSpans || headerCellsInMultipleRows;
    if (shouldHaveHeaders) {
      editor.withoutNormalizing(() => {
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

              const isBody = isTableBodyElement(parent);

              const headers = getHeader(matrix, rowIndex, cellIndex, node.rowHeaders);
              const id = getId(matrix, rowIndex, cellIndex, isBody);

              if (id !== cell.data.id || headers !== cell.data.headers) {
                updateCell(editor, cell, { id: id, headers: headers }, TABLE_CELL_HEADER_ELEMENT_TYPE);
              }
            }
          });
        });
      });
      return true;
    }

    const containsIdOrHeaders = !!editor
      .nodes({ match: (n) => isAnyTableCellElement(n) && (!!n.data.id || !!n.data.headers), at: path })
      .next().value;

    // Only remove headers if cell is only associated with 1 cell and there is cells with Id and headers in the table
    const shouldRemoveHeaders = !shouldHaveHeaders && containsIdOrHeaders;

    if (shouldRemoveHeaders && containsIdOrHeaders) {
      editor.withoutNormalizing(() => {
        matrix?.forEach((row) => {
          row.forEach((cell) => {
            if (cell.data.id || cell.data.headers) {
              updateCell(editor, cell, { id: undefined, headers: undefined });
            }
          });
        });
      });
      return true;
    }

    return false;
  },
});
