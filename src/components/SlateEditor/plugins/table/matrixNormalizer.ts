/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Path, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { defaultTableRowBlock } from "./defaultBlocks";
import { TableMatrix, TableSectionElement } from "./interfaces";
import { getPrevCell, countMatrixRowCells, insertCellInMatrix } from "./matrixHelpers";
import { insertEmptyCells, updateCell, increaseTableSectionWidth } from "./slateActions";
import { getTableSectionWidth } from "./slateHelpers";
import { TABLE_CELL_ELEMENT_TYPE, TABLE_CELL_HEADER_ELEMENT_TYPE } from "./types";
import {
  isAnyTableCellElement,
  isTableElement,
  isTableHeadElement,
  isTableRowElement,
  isTableSectionElement,
} from "./queries";

// Before placing a cell in the table matrix, make sure the cell has the required space
// If not, add the required space by inserting empty cells.
const normalizeCell = (editor: Editor, matrix: TableMatrix, rowIndex: number, colspan: number, rowspan: number) => {
  for (const [colIndex, cell] of matrix[rowIndex].entries()) {
    if (cell) {
      continue;
    } else {
      // The cell should be placed at this index, spanning in both column and row direction.
      // Check that no other cells are blocking the required space.
      for (let r = rowIndex; r < rowIndex + rowspan; r++) {
        for (let c = colIndex; c < colIndex + colspan; c++) {
          if (matrix?.[r]?.[c]) {
            // A cell is blocking required space. Insert the required amount of cells to push the blocking cell to the right.
            const stepsRight = colIndex + colspan - c;
            const cellPath = ReactEditor.findPath(editor, matrix[r][c]);
            insertEmptyCells(editor, cellPath, stepsRight);

            return true;
          }
        }
      }
      return false;
    }
  }
  return false;
};

// Normalize <tr>. Returns true if normalization occurs.
const normalizeRow = (
  editor: Editor,
  matrix: TableMatrix,
  rowIndex: number,
  tableSection: TableSectionElement,
  tableSectionPath: Path,
): boolean => {
  // A. If row does not exist in slate => Insert empty row
  if (!Editor.hasPath(editor, [...tableSectionPath, rowIndex])) {
    Transforms.insertNodes(editor, defaultTableRowBlock(1), {
      at: [...tableSectionPath, rowIndex],
    });
    return true;
  }

  // B. Insert empty cell if missing
  for (const [columnIndex, element] of matrix[rowIndex].entries()) {
    if (!element && columnIndex === 0) {
      const targetPath = [...tableSectionPath, rowIndex, 0];
      insertEmptyCells(editor, targetPath, 1);
      return true;
    }
  }

  // C. Make sure isHeader and scope is set correctly in cells in header and body
  const [table] = Editor.node(editor, Path.parent(tableSectionPath));
  if (isTableElement(table)) {
    const isHead = isTableHeadElement(tableSection);
    const { rowHeaders } = table;
    // Check every cell of the row to be normalized

    const row = matrix[rowIndex].entries();
    for (const [index, cell] of row) {
      // A. Normalize table head
      if (cell) {
        const hasScope = "scope" in cell.data ? cell.data.scope : undefined;
        if (isHead) {
          // i. If cell in header
          //    Make sure scope='col' and isHeader=true and type is correct
          if (cell.type !== TABLE_CELL_HEADER_ELEMENT_TYPE || cell.data.scope !== "col") {
            updateCell(editor, cell, { scope: "col" }, TABLE_CELL_HEADER_ELEMENT_TYPE);
            return true;
          }
        } else {
          // i. If table does not have headers on rows
          //    Make sure cells in body has scope=undefined and isHeader=false
          if (!rowHeaders && (cell.type === TABLE_CELL_HEADER_ELEMENT_TYPE || hasScope)) {
            updateCell(
              editor,
              cell,
              {
                scope: undefined,
              },
              TABLE_CELL_ELEMENT_TYPE,
            );
            return true;
          }

          // ii. If table has headers on rows
          //    First cell in row should be a header
          //    Other cells should not be a header
          if (rowHeaders) {
            if (index === 0) {
              if (cell.type !== TABLE_CELL_HEADER_ELEMENT_TYPE || cell.data.scope !== "row") {
                updateCell(
                  editor,
                  cell,
                  {
                    scope: "row",
                  },
                  TABLE_CELL_HEADER_ELEMENT_TYPE,
                );
                return true;
              }
            } else {
              if (
                (cell.type === TABLE_CELL_HEADER_ELEMENT_TYPE || hasScope) &&
                getPrevCell(matrix, rowIndex, index) !== cell
              ) {
                updateCell(
                  editor,
                  cell,
                  {
                    scope: undefined,
                  },
                  TABLE_CELL_ELEMENT_TYPE,
                );
                return true;
              }
            }
          }
        }
      }
    }
  }

  // D. Compare width of previous and current row and insert empty cells if they are of unequal length.
  if (rowIndex > 0) {
    const lengthDiff = matrix[rowIndex].filter(Boolean).length - matrix[rowIndex - 1].length;

    // Previous row is shorter
    if (lengthDiff > 0) {
      const rowEndPath = Path.next([...tableSectionPath, rowIndex - 1, countMatrixRowCells(matrix, rowIndex - 1) - 1]);
      insertEmptyCells(editor, rowEndPath, lengthDiff);
      return true;

      // Current row is shorter. Insert empty cells.
    } else if (lengthDiff < 0) {
      const lastCellPath = [...tableSectionPath, rowIndex, countMatrixRowCells(matrix, rowIndex) - 1];

      // In case current row does not exist in Slate, insert an entire row.
      if (!Editor.hasPath(editor, [...tableSectionPath, rowIndex])) {
        Transforms.insertNodes(editor, defaultTableRowBlock(Math.abs(lengthDiff)), {
          at: [...tableSectionPath, rowIndex],
        });
        return true;
      }
      const targetPath = Path.next(lastCellPath);
      insertEmptyCells(editor, targetPath, Math.abs(lengthDiff));
      return true;
    }
  }
  return false;
};

// Normalize <head> or <body>. Return true if normalization occurs.
export const normalizeTableSectionAsMatrix = (
  editor: Editor,
  section: TableSectionElement,
  sectionPath: Path,
): boolean => {
  const matrix: TableMatrix = [];

  // Build up a matrix by inserting and normalizing one row at a time
  for (const [rowIndex, row] of section.children.entries()) {
    if (!isTableRowElement(row)) {
      return false;
    }
    if (!matrix[rowIndex]) {
      matrix[rowIndex] = [];
    }

    // A. Insert all cells in a each row into a matrix. Normalize if needed.
    for (const cell of row.children) {
      if (!isAnyTableCellElement(cell)) {
        return false;
      }

      const colspan = cell?.data?.colspan;
      const rowspan = cell?.data?.rowspan;

      // i. Check if next element can be placed in matrix without needing a normalize.
      // Normalize if needed. This will restart the normalization.
      if (normalizeCell(editor, matrix, rowIndex, colspan, rowspan)) {
        return true;
      }

      // ii. Place cell in matrix
      insertCellInMatrix(matrix, rowIndex, colspan, rowspan, cell);
    }
    // B. Validate insertion of the current row. This will automatically restart the normalization if true.
    if (normalizeRow(editor, matrix, rowIndex, section, sectionPath)) {
      return true;
    }
  }

  // B. Rowspan can cause matrix to have more rows than slate. Normalize if needed.
  if (section.children.length < matrix.length) {
    if (normalizeRow(editor, matrix, section.children.length, section, sectionPath)) {
      return true;
    }
  }

  // C. Previous header/body can have different width. Add cells if necessary.
  if (Path.hasPrevious(sectionPath)) {
    const [previousSection, previousSectionPath] = Editor.node(editor, Path.previous(sectionPath));
    if (isTableSectionElement(previousSection)) {
      const previousSectionWidth = getTableSectionWidth(previousSection);
      const currentSectionWidth = getTableSectionWidth(section);

      const widthDiff = currentSectionWidth - previousSectionWidth;

      // i. Previous section is narrower. Add cells in all rows in previous section
      if (widthDiff > 0) {
        increaseTableSectionWidth(editor, previousSection, previousSectionPath, widthDiff);
        return true;
        // ii. Current section is narrower. Add cells to all rows in current section
      } else if (widthDiff < 0) {
        increaseTableSectionWidth(editor, section, sectionPath, widthDiff);
        return true;
      }
    }
    // D. Next head/body can have different width. Add cells if necessary.
  } else if (Editor.hasPath(editor, Path.next(sectionPath))) {
    const [nextSection, nextSectionPath] = Editor.node(editor, Path.next(sectionPath));
    if (isTableSectionElement(nextSection)) {
      const nextSectionWidth = getTableSectionWidth(nextSection);
      const currentSectionWidth = getTableSectionWidth(section);

      const widthDiff = currentSectionWidth - nextSectionWidth;

      // i. First row in next section is narrower. Add cells in that row
      if (widthDiff > 0) {
        const targetRow = nextSection.children[0];
        if (isTableRowElement(targetRow)) {
          const targetPath = [...nextSectionPath, 0, targetRow.children.length];
          insertEmptyCells(editor, targetPath, widthDiff);
          return true;
        }

        // ii. Current section is narrower. Add cells in all rows
      } else if (widthDiff < 0) {
        increaseTableSectionWidth(editor, section, sectionPath, widthDiff);
        return true;
      }
    }
  }

  return false;
};
