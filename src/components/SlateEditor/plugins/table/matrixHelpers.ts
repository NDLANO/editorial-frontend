/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { compact, isEqual, uniq } from "lodash-es";
import { TableCellElement, TableMatrix } from "./interfaces";
import { TYPE_TABLE_CELL_HEADER } from "./types";

export const getPrevCell = (matrix: TableMatrix, row: number, column: number) => {
  return matrix[row][column - 1];
};

// Find the matrix coordinates for a cell. Returns the coordinates for top left corner of cell.
export const findCellCoordinate = (matrix: TableMatrix, targetCell: TableCellElement): [number, number] | undefined => {
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
  for (const [colIndex, cellMatrix] of matrix[rowIndex].entries()) {
    if (cellMatrix) {
      continue;
    } else {
      insertCellHelper(matrix, cell, rowIndex, rowspan, colIndex, colIndex + colspan);
      return;
    }
  }
  // C. Otherwise place cell at end of row.
  insertCellHelper(matrix, cell, rowIndex, rowspan, rowLength, rowLength + colspan);
};

const normalizeRow = (row: TableCellElement[]) => {
  const cells: TableCellElement[] = [];
  row.forEach((cell) => [...Array(cell?.data?.colspan)].forEach(() => cells.push(cell)));
  return cells;
};

// Check if previous cell in both col or row is equal
export const previousMatrixCellIsEqualCurrent = (matrix: TableMatrix, rowIndex: number, columnIndex: number) =>
  (matrix?.[rowIndex]?.[columnIndex]?.data?.colspan > 1 &&
    isEqual(matrix?.[rowIndex]?.[columnIndex - 1]?.children, matrix?.[rowIndex]?.[columnIndex]?.children)) ||
  (matrix[rowIndex][columnIndex].data.rowspan > 1 &&
    isEqual(matrix?.[rowIndex - 1]?.[columnIndex]?.children, matrix?.[rowIndex]?.[columnIndex]?.children));

// Creates an header object depending on the ID's of the header cells surrounding it.
// If colspan or rowspan we check the corresponding neighbor cells for the headercells.
export const getHeader = (matrix: TableMatrix, rowIndex: number, columnIndex: number, isRowHeaders: boolean) => {
  const { colspan, rowspan } = matrix[rowIndex][columnIndex].data;

  const normalizedHeaderRow = normalizeRow(matrix[0]);
  if (matrix?.[rowIndex]?.[columnIndex]?.type !== TYPE_TABLE_CELL_HEADER) {
    const headers: TableCellElement[] = [];

    // First header row
    // Adding all the cells in the corresponding colspan
    Array.from({ length: colspan }).forEach((_, it) => headers.push(normalizedHeaderRow[columnIndex + it]));

    // Second header row
    // If there is a second header row, the index 1 1  of the matrix will be of type table cell header
    if (matrix?.[1]?.[1]?.type === TYPE_TABLE_CELL_HEADER) {
      const normalizedSecondHeaderRow = normalizeRow(matrix[1]);
      Array.from({ length: colspan }).forEach((_, it) => headers.push(normalizedSecondHeaderRow[columnIndex + it]));
    }

    // If row headers we append all row headers following the rowspan.
    if (isRowHeaders && columnIndex !== 0) {
      Array.from({ length: rowspan }).forEach((_, it) => headers.push(matrix?.[rowIndex + it]?.[0]));
    }

    const header = headers
      .map((cell) => cell?.data?.id)
      .filter((cell) => !!cell)
      .join(" ");

    return header.trim().length > 0 ? header : undefined;
  }
  return undefined;
};

export const getId = (matrix: TableMatrix, rowIndex: number, columnIndex: number, isRowHeader: boolean) => {
  if (!isRowHeader && rowIndex === 0 && matrix?.[rowIndex]?.[columnIndex]?.type === TYPE_TABLE_CELL_HEADER) {
    return `0${columnIndex}`;
  }

  if (matrix?.[rowIndex]?.[columnIndex]?.type === TYPE_TABLE_CELL_HEADER) {
    return isRowHeader ? `r${rowIndex}` : `0${rowIndex}1${columnIndex}`;
  }

  return undefined;
};
