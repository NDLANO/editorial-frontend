/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Path } from "slate";
import { TableMatrix } from "./interfaces";
import { insertCellInMatrix } from "./matrixHelpers";
import { isAnyTableCellElement, isTableElement, isTableRowElement, isTableSectionElement } from "./queries";

// Expects a perfectly normalized table. Requires path to the table section
export const getTableSectionAsMatrix = (editor: Editor, path: Path) => {
  if (!Editor.hasPath(editor, path)) return;
  const [tableSection] = Editor.node(editor, path);
  if (!isTableSectionElement(tableSection)) return;
  const matrix: TableMatrix = [];

  // Build up a matrix one row at a time.
  tableSection.children.forEach((row, rowIndex) => {
    if (!isTableRowElement(row)) return;
    if (!matrix[rowIndex]) {
      matrix[rowIndex] = [];
    }

    for (const cell of row.children) {
      if (!isAnyTableCellElement(cell)) return;

      const colspan = cell.data.colspan;
      const rowspan = cell.data.rowspan;
      insertCellInMatrix(matrix, rowIndex, colspan, rowspan, cell);
    }
  });

  return matrix;
};

// Expects a perfectly normalized table. Requires path to the table
export const getTableAsMatrix = (editor: Editor, path: Path) => {
  if (!Editor.hasPath(editor, path)) return;
  const [table] = Editor.node(editor, path);
  if (!isTableElement(table)) return;
  const matrix: TableMatrix = [];

  // Merge all rows in head and body. Then build up a matrix one row at a time.
  table.children
    .reduce((acc, cur) => {
      if (isTableSectionElement(cur)) {
        acc.push(...cur.children);
      }
      return acc;
    }, [] as Descendant[])
    .forEach((row, rowIndex) => {
      if (!isTableRowElement(row)) return;
      if (!matrix[rowIndex]) {
        matrix[rowIndex] = [];
      }

      for (const cell of row.children) {
        if (!isAnyTableCellElement(cell)) return;

        const colspan = cell.data.colspan;
        const rowspan = cell.data.rowspan;
        insertCellInMatrix(matrix, rowIndex, colspan, rowspan, cell);
      }
    });

  return matrix;
};
