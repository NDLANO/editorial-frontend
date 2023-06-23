/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { TableCellElement, TableMatrix } from './interfaces';

export const getPrevCell = (matrix: TableMatrix, row: number, column: number) => {
  return matrix[row][column - 1];
};

// Find the matrix coordinates for a cell. Returns the coordinates for top left corner of cell.
export const findCellCoordinate = (
  matrix: TableMatrix,
  targetCell: TableCellElement,
): [number, number] | undefined => {
  for (const [rowIndex, row] of matrix.entries()) {
    for (const [cellIndex, cell] of row.entries()) {
      if (cell === targetCell) {
        return [rowIndex, cellIndex];
      }
    }
  }
};

export const getMatrixColumn = (matrix: TableMatrix, index: number) => {
  const column = matrix.map((row) => row[index]);
  return uniq(column);
};

// Find the amount of cells in a matrix row.
export const countMatrixRowCells = (matrix: TableMatrix, rowIndex: number): number => {
  return compact([...new Set(matrix[rowIndex])]).filter((cell) =>
    rowIndex > 0 ? !matrix[rowIndex - 1].includes(cell) : true,
  ).length;
};

const insertCellHelper = (
  matrix: TableMatrix,
  cell: TableCellElement,
  rowIndex: number,
  rowspan: number,
  colStart: number,
  colEnd: number,
) => {
  for (let r = rowIndex; r < rowIndex + rowspan; r++) {
    for (let c = colStart; c < colEnd; c++) {
      if (!matrix[r]) {
        matrix[r] = [];
      }
      matrix[r][c] = cell;
    }
  }
};

/**
 * Insert cellElement into the matrix and the first available column in rowIndex.
 * Example:
 * A cell with rowspan=2 and colspan=4 will be inserted in 8 slots.
 * It will represent the 2x4 area of cells it covers in the html-table.
 */
export const insertCellInMatrix = (
  matrix: TableMatrix,
  rowIndex: number,
  colspan: number,
  rowspan: number,
  cell: TableCellElement,
) => {
  const rowLength = matrix[rowIndex].length;
  // A. If row has no elements => Place cell at start of the row.
  if (rowLength === 0) {
    insertCellHelper(matrix, cell, rowIndex, rowspan, 0, colspan);
    return;
  }
  // B. If there are open slots in the row => Place cell at first open slot.
  for (const [colIndex, cell] of matrix[rowIndex].entries()) {
    if (cell) {
      continue;
    } else {
      insertCellHelper(matrix, cell, rowIndex, rowspan, colIndex, colIndex + colspan);
      return;
    }
  }
  // C. Otherwise place cell at end of row.
  insertCellHelper(matrix, cell, rowIndex, rowspan, rowLength, rowLength + colspan);
};
