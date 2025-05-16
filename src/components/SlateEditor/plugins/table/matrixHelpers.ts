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
import { isTableCellHeaderElement } from "./queries";

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
    isEqual(matrix?.[rowIndex]?.[columnIndex - 1], matrix?.[rowIndex]?.[columnIndex])) ||
  (matrix[rowIndex][columnIndex].data.rowspan > 1 &&
    isEqual(matrix?.[rowIndex - 1]?.[columnIndex], matrix?.[rowIndex]?.[columnIndex]));

// Check if the row only contains TableCellHeader elements
const isHeaderRow = (row?: TableCellElement[]) =>
  row?.reduce((acc, cell) => acc && isTableCellHeaderElement(cell), true);

// Creates an header object depending on the ID's of the header cells surrounding it.
// If colspan or rowspan we check the corresponding neighbor cells for the headercells.
export const getHeader = (matrix: TableMatrix, rowIndex: number, columnIndex: number, isRowHeaders: boolean) => {
  const { colspan, rowspan } = matrix[rowIndex][columnIndex].data;

  if (matrix?.[rowIndex]?.[columnIndex]?.type !== TYPE_TABLE_CELL_HEADER) {
    const headers: TableCellElement[] = [];

    // Check if the first row is a headerrow
    // For the length of the cells colspan, append all header cells vertical to the spanned cell
    if (isHeaderRow(matrix?.[0])) {
      const normalizedHeaderRow = normalizeRow(matrix[0]);
      Array.from({ length: colspan }).forEach((_, it) => headers.push(normalizedHeaderRow[columnIndex + it]));
    }

    // Check if the second row is a headerrow
    // For the length of the cells colspan, append all header cells vertical to the spanned cell
    if (isHeaderRow(matrix?.[1])) {
      const normalizedSecondHeaderRow = normalizeRow(matrix[1]);
      Array.from({ length: colspan }).forEach((_, it) => headers.push(normalizedSecondHeaderRow[columnIndex + it]));
    }

    // If rowHeaders is sat, append all header cells horizontal to the cell spanned over multiple rows.
    if (isRowHeaders) {
      Array.from({ length: rowspan }).forEach((_, it) => headers.push(matrix?.[rowIndex + it]?.[0]));
    }

    // Creating a header string of all the header cells which is targeting the cell
    const header = uniq(headers.filter((cell) => !!cell).map((cell) => cell?.data?.id))
      .join(" ")
      .trim();

    return header.length > 0 ? header : undefined;
  }
  return undefined;
};

// Create the id for the selected TableHeaderCell element
export const getId = (matrix: TableMatrix, rowIndex: number, columnIndex: number, isRowHeader: boolean) => {
  // Only add ID's to TableCellHeader elements
  if (matrix?.[rowIndex]?.[columnIndex]?.type === TYPE_TABLE_CELL_HEADER) {
    //If the cell is on the first row and the first row is headerrow
    if (rowIndex === 0 && isHeaderRow(matrix?.[0])) {
      return `0${columnIndex}`;
    }

    // If rowHeader is enabled use rowHeader id otherwise it must be the second headerrow
    return isRowHeader ? `r${rowIndex}` : `0${rowIndex}1${columnIndex}`;
  }

  return undefined;
};
