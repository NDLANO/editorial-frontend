/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, NodeEntry, Path, Point, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { TableBodyElement, TableCellElement, TableElement, TableHeadElement, TableRowElement } from "./interfaces";
import { getTableAsMatrix } from "./matrix";
import { findCellCoordinate } from "./matrixHelpers";
import { createIdenticalRow, isTable, isTableBody, isTableCell, isTableHead } from "./slateHelpers";
import getCurrentBlock from "../../utils/getCurrentBlock";
import { TYPE_TABLE_CAPTION } from "./types";

const getTableCell = (editor: Editor) => {
  const [cellEntry] = Editor.nodes<TableCellElement>(editor, {
    at: editor?.selection?.anchor.path,
    match: (node) => isTableCell(node),
  });

  return !!cellEntry ? cellEntry : undefined;
};

const getTableBody = (editor: Editor) => {
  const [cellEntry] = Editor.nodes<TableBodyElement | TableHeadElement>(editor, {
    at: editor?.selection?.anchor.path,
    match: (node) => isTableBody(node) || isTableHead(node),
  });

  return cellEntry;
};

const getTable = (editor: Editor) => {
  const [cellEntry] = Editor.nodes<TableElement>(editor, {
    at: editor?.selection?.anchor.path,
    match: isTable,
  });

  return cellEntry;
};

const getTableRow = (editor: Editor) => {
  const [cellEntry] = Editor.nodes<TableRowElement>(editor, {
    at: editor?.selection?.anchor.path,
    match: isTableCell,
  });

  return cellEntry;
};

export const onBackspace = (event: KeyboardEvent, editor: Editor) => {
  const cell = getTableCell(editor);
  if (!cell) return;

  const [_cellNode, cellPath] = cell;

  const firstCellPoint = Editor.point(editor, cellPath, { edge: "start" });
  // Prevent action if at start of cell
  if (editor.selection && Range.isCollapsed(editor.selection)) {
    if (Point.equals(editor.selection.anchor, firstCellPoint)) {
      event.preventDefault();
    }
  }
};

export const onDelete = (event: KeyboardEvent, editor: Editor) => {
  const cell = getTableCell(editor);
  if (!cell) return;

  const [_cellNode, cellPath] = cell;

  const lastCellPoint = Editor.point(editor, cellPath, { edge: "end" });

  // Prevent action if at end of cell
  if (editor.selection && Range.isCollapsed(editor.selection)) {
    if (Point.equals(editor.selection.anchor, lastCellPoint)) {
      event.preventDefault();
    }
  }
};

export const onTab = (event: KeyboardEvent, editor: Editor) => {
  const cell = getTableCell(editor);
  const table = getTable(editor);
  const body = getTableBody(editor);
  const row = getTableRow(editor);

  if (!cell || !table || !body || !row) return;

  const [_cellNode, cellPath] = cell;
  const [_bodyNode, bodyPath] = body;
  const [_tableNode, tablePath] = table;
  event.preventDefault();

  if (event.shiftKey) {
    return onLeft(editor, cellPath, bodyPath, tablePath, row);
  }
  return onRight(editor, cellPath, bodyPath, tablePath, row);
};

const onLeft = (editor: Editor, cellPath: Path, bodyPath: Path, tablePath: Path, row: NodeEntry<TableRowElement>) => {
  const [rowNode, rowPath] = row;

  // A. If a previous cell exists, move to it.
  if ((Path.hasPrevious(cellPath) || Path.hasPrevious(rowPath) || Path.hasPrevious(bodyPath)) && editor.selection) {
    Transforms.select(editor, Editor.start(editor, cellPath));
    Transforms.move(editor, { reverse: true });
    Transforms.select(editor, Editor.range(editor, editor.selection.anchor.path));
    return;
  }

  // B. If at first cell in table, insert new identical row.
  if (Path.equals([...tablePath, 0, 0, 0], cellPath)) {
    const targetPath = [...tablePath, 0, 0];
    Transforms.insertNodes(editor, createIdenticalRow(rowNode), { at: targetPath });
    Transforms.select(editor, {
      anchor: Editor.point(editor, targetPath, { edge: "end" }),
      focus: Editor.point(editor, targetPath, { edge: "end" }),
    });
  }
};

const onRight = (editor: Editor, cellPath: Path, bodyPath: Path, tablePath: Path, row: NodeEntry<TableRowElement>) => {
  const [rowNode, rowPath] = row;

  const nextPath = Path.next(cellPath);
  const nextRowPath = Path.next(rowPath);
  const nextBodyPath = Path.next(bodyPath);

  // A. If next cell exists, move to it.
  if (
    (Editor.hasPath(editor, nextPath) || Editor.hasPath(editor, nextRowPath) || Editor.hasPath(editor, nextBodyPath)) &&
    editor.selection
  ) {
    Transforms.select(editor, Editor.end(editor, cellPath));
    Transforms.move(editor);
    Transforms.select(editor, Editor.range(editor, editor.selection.anchor.path));
    return;
  }

  const TableEndPoint = Editor.point(editor, tablePath, { edge: "end" });

  // B. If at last cell in table, insert new identical row.
  if (Path.isDescendant(TableEndPoint.path, cellPath)) {
    Transforms.insertNodes(editor, createIdenticalRow(rowNode), {
      at: nextRowPath,
    });
    Transforms.select(editor, {
      anchor: Editor.point(editor, nextRowPath, { edge: "start" }),
      focus: Editor.point(editor, nextRowPath, { edge: "start" }),
    });
  }
};

export const onDown = (event: KeyboardEvent, editor: Editor) => {
  const cell = getTableCell(editor);
  const table = getTable(editor);

  if (!cell || !table) return;

  const [cellNode, cellPath] = cell;
  const [_tableNode, tablePath] = table;

  event.preventDefault();
  const matrix = getTableAsMatrix(editor, tablePath);

  if (matrix) {
    const matrixPath = findCellCoordinate(matrix, cellNode);
    if (matrixPath) {
      const nextCell = matrix[matrixPath[0] + cellNode.data.rowspan]?.[matrixPath[1]];

      // A. If cell exist below, move to it.
      if (nextCell) {
        const nextCellPath = ReactEditor.findPath(editor, nextCell);
        const nextCellPoint = Editor.point(editor, nextCellPath, {
          edge: "start",
        });
        return Transforms.select(editor, {
          anchor: nextCellPoint,
          focus: nextCellPoint,
        });
        // B. If cell exist to the right. Move to it.
      } else if (Editor.hasPath(editor, Path.next(cellPath))) {
        const nextCellPoint = Editor.point(editor, Path.next(cellPath), {
          edge: "start",
        });
        return Transforms.select(editor, {
          anchor: nextCellPoint,
          focus: nextCellPoint,
        });
        // C. Move out of table.
      } else {
        const nextPoint = Editor.point(editor, Path.next(tablePath), {
          edge: "end",
        });
        return Transforms.select(editor, {
          anchor: nextPoint,
          focus: nextPoint,
        });
      }
    }
  }
};

export const onUp = (event: KeyboardEvent, editor: Editor) => {
  const cell = getTableCell(editor);
  const table = getTable(editor);

  if (!cell || !table) return;

  const [cellNode, cellPath] = cell;
  const [_tableNode, tablePath] = table;

  event.preventDefault();
  const matrix = getTableAsMatrix(editor, tablePath);

  if (matrix) {
    const matrixPath = findCellCoordinate(matrix, cellNode);
    if (matrixPath) {
      // A. If cell exist above, move to it.
      if (matrixPath[0] > 0) {
        const previousCell = matrix[matrixPath[0] - 1]?.[matrixPath[1]];
        const previousCellPath = ReactEditor.findPath(editor, previousCell);
        const previousCellPoint = Editor.point(editor, previousCellPath, {
          edge: "start",
        });
        return Transforms.select(editor, {
          anchor: previousCellPoint,
          focus: previousCellPoint,
        });
        // B. If cell exist to the left, move to it.
      } else if (Path.hasPrevious(cellPath) && Editor.hasPath(editor, Path.previous(cellPath))) {
        const previousCellPoint = Editor.point(editor, Path.previous(cellPath), { edge: "start" });
        return Transforms.select(editor, {
          anchor: previousCellPoint,
          focus: previousCellPoint,
        });
        // C. Move out of table
      } else if (Path.hasPrevious(tablePath)) {
        const previousPoint = Editor.point(editor, Path.previous(tablePath), {
          edge: "end",
        });
        return Transforms.select(editor, {
          anchor: previousPoint,
          focus: previousPoint,
        });
      }
    }
  }
};

export const onEnter = (event: KeyboardEvent, editor: Editor, onKeyDown?: (e: KeyboardEvent) => void) => {
  const entry = getCurrentBlock(editor, TYPE_TABLE_CAPTION);
  if (!entry) {
    return onKeyDown?.(event);
  }
  const [captionNode] = entry;

  if (captionNode) {
    return event.preventDefault();
  }
};
