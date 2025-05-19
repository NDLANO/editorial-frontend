/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, NodeEntry, Path, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import {
  TableCellElement,
  TableElement,
  TableHeaderCellElement,
  TableRowElement,
  TableSectionElement,
} from "./interfaces";
import { getTableAsMatrix } from "./matrix";
import { findCellCoordinate } from "./matrixHelpers";
import { createIdenticalRow } from "./slateHelpers";
import { Logger } from "@ndla/editor";

export const moveLeft = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  sectionEntry: NodeEntry<TableSectionElement>,
  rowEntry: NodeEntry<TableRowElement>,
  cellEntry: NodeEntry<TableCellElement>,
  logger: Logger,
) => {
  const tablePath = tableEntry[1];
  const sectionPath = sectionEntry[1];
  const [row, rowPath] = rowEntry;
  const cellPath = cellEntry[1];

  // A. If a previous cell exists, move to it.
  if ((Path.hasPrevious(cellPath) || Path.hasPrevious(rowPath) || Path.hasPrevious(sectionPath)) && editor.selection) {
    logger.log("Moving left in table");
    Transforms.select(editor, Editor.start(editor, cellEntry[1]));
    Transforms.move(editor, { reverse: true });
    Transforms.select(editor, Editor.range(editor, editor.selection.anchor.path));
    return;
  }

  // B. If at first cell in table, insert new identical row.
  if (Path.equals([...tablePath, 0, 0, 0], cellPath)) {
    const targetPath = [...tablePath, 0, 0];
    // TODO: Investigate whether this ever happens.
    logger.log("Tried moving left in first cell in the table. Inserting new row.");
    Transforms.insertNodes(editor, createIdenticalRow(row), { at: targetPath });
    Transforms.select(editor, {
      anchor: Editor.point(editor, targetPath, { edge: "end" }),
      focus: Editor.point(editor, targetPath, { edge: "end" }),
    });
  }
};

export const moveRight = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  sectionEntry: NodeEntry<TableSectionElement>,
  rowEntry: NodeEntry<TableRowElement>,
  cellEntry: NodeEntry<TableCellElement>,
  logger: Logger,
) => {
  const tablePath = tableEntry[1];
  const sectionPath = sectionEntry[1];
  const [row, rowPath] = rowEntry;
  const cellPath = cellEntry[1];
  const nextPath = Path.next(cellPath);
  const nextRowPath = Path.next(rowPath);
  const nextSectionPath = Path.next(sectionPath);

  // A. If next cell exists, move to it.
  if (
    (Editor.hasPath(editor, nextPath) ||
      Editor.hasPath(editor, nextRowPath) ||
      Editor.hasPath(editor, nextSectionPath)) &&
    editor.selection
  ) {
    logger.log("Moving right in table");
    Transforms.select(editor, Editor.end(editor, cellEntry[1]));
    Transforms.move(editor);
    Transforms.select(editor, Editor.range(editor, editor.selection.anchor.path));
    return;
  }

  const TableEndPoint = Editor.point(editor, tablePath, { edge: "end" });

  // B. If at last cell in table, insert new identical row.
  if (Path.isDescendant(TableEndPoint.path, cellPath)) {
    logger.log("Tried moving right in last cell in the table. Inserting new row.");
    Transforms.insertNodes(editor, createIdenticalRow(row), {
      at: nextRowPath,
    });
    Transforms.select(editor, {
      anchor: Editor.point(editor, nextRowPath, { edge: "start" }),
      focus: Editor.point(editor, nextRowPath, { edge: "start" }),
    });
  }
};

export const moveDown = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  cellEntry: NodeEntry<TableCellElement | TableHeaderCellElement>,
  logger: Logger,
) => {
  const tablePath = tableEntry[1];

  const [cell, cellPath] = cellEntry;

  const matrix = getTableAsMatrix(editor, tablePath);

  if (matrix) {
    const matrixPath = findCellCoordinate(matrix, cell);
    if (matrixPath) {
      const nextCell = matrix[matrixPath[0] + cell.data.rowspan]?.[matrixPath[1]];

      // A. If cell exist below, move to it.
      if (nextCell) {
        const nextCellPath = ReactEditor.findPath(editor, nextCell);
        const nextCellPoint = Editor.point(editor, nextCellPath, {
          edge: "start",
        });
        logger.log("Moving down in matrix");
        return Transforms.select(editor, {
          anchor: nextCellPoint,
          focus: nextCellPoint,
        });
        // B. If cell exist to the right. Move to it.
      } else if (Editor.hasPath(editor, Path.next(cellPath))) {
        const nextCellPoint = Editor.point(editor, Path.next(cellPath), {
          edge: "start",
        });
        logger.log("Moving right in matrix");
        return Transforms.select(editor, {
          anchor: nextCellPoint,
          focus: nextCellPoint,
        });
        // C. Move out of table.
      } else {
        const nextPoint = Editor.point(editor, Path.next(tablePath), {
          edge: "end",
        });
        logger.log("Moving out of table");
        return Transforms.select(editor, {
          anchor: nextPoint,
          focus: nextPoint,
        });
      }
    }
  }
};

export const moveUp = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  cellEntry: NodeEntry<TableCellElement>,
  logger: Logger,
) => {
  const tablePath = tableEntry[1];

  const [cell, cellPath] = cellEntry;

  const matrix = getTableAsMatrix(editor, tablePath);

  if (matrix) {
    const matrixPath = findCellCoordinate(matrix, cell);
    if (matrixPath) {
      // A. If cell exist above, move to it.
      if (matrixPath[0] > 0) {
        const previousCell = matrix[matrixPath[0] - 1]?.[matrixPath[1]];
        const previousCellPath = ReactEditor.findPath(editor, previousCell);
        const previousCellPoint = Editor.point(editor, previousCellPath, {
          edge: "start",
        });
        logger.log("Moving up in matrix");
        return Transforms.select(editor, {
          anchor: previousCellPoint,
          focus: previousCellPoint,
        });
        // B. If cell exist to the left, move to it.
      } else if (Path.hasPrevious(cellPath) && Editor.hasPath(editor, Path.previous(cellPath))) {
        const previousCellPoint = Editor.point(editor, Path.previous(cellPath), { edge: "start" });
        logger.log("Moving left in matrix");
        return Transforms.select(editor, {
          anchor: previousCellPoint,
          focus: previousCellPoint,
        });
        // C. Move out of table
      } else if (Path.hasPrevious(tablePath)) {
        const previousPoint = Editor.point(editor, Path.previous(tablePath), {
          edge: "end",
        });
        logger.log("Moving out of table");
        return Transforms.select(editor, {
          anchor: previousPoint,
          focus: previousPoint,
        });
      }
    }
  }
};
