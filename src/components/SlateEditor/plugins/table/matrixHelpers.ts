/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import compact from "lodash/compact";
import { equals } from "lodash/fp";
import isEqual from "lodash/isEqual";
import uniq from "lodash/uniq";
import { Editor, Path } from "slate";
import { TableCellElement, TableElement, TableHeaderCellElement, TableMatrix } from "./interfaces";
import { updateCell } from "./slateActions";
import { isTableHead, isTableBody, isTableCellHeader } from "./slateHelpers";
import { TYPE_TABLE_CELL, TYPE_TABLE_CELL_HEADER } from "./types";

export const getPrevCell = (matrix: TableMatrix, row: number, column: number) => {
  return matrix[row][column - 1];
};

// Find the matrix coordinates for a cell. Returns the coordinates for top left corner of cell.
export const findCellCoordinate = (
  matrix: TableMatrix,
  targetCell: TableCellElement | TableHeaderCellElement,
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
  cell: TableCellElement | TableHeaderCellElement,
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
  cell: TableCellElement | TableHeaderCellElement,
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

const normalizeRow = (row: (TableHeaderCellElement | TableCellElement)[]) => {
  const cells: (TableCellElement | TableHeaderCellElement)[] = [];
  row.forEach((cell) => [...Array(cell?.data?.colspan)].forEach((_) => cells.push(cell)));
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

  const normalizedHeaderRow: TableHeaderCellElement[] = normalizeRow(matrix[0]).filter(isTableCellHeader);
  const headers: TableHeaderCellElement[] = [];

  // First header row
  // Adding all the cells in the corresponding colspan
  [...Array(colspan)].forEach(
    (_, it) => normalizedHeaderRow[columnIndex + it] && headers.push(normalizedHeaderRow[columnIndex + it]),
  );

  // Second header row
  // If there is a second header row, the index 1 1  of the matrix will be of type table cell header
  if (
    matrix?.[1]?.[1]?.type === TYPE_TABLE_CELL_HEADER &&
    matrix?.[rowIndex]?.[columnIndex].type !== TYPE_TABLE_CELL_HEADER
  ) {
    const normalizedSecondHeaderRow = normalizeRow(matrix[1]).filter(isTableCellHeader);
    [...Array(colspan)].forEach(
      (_, it) =>
        normalizedSecondHeaderRow?.[columnIndex + it] && headers.push(normalizedSecondHeaderRow[columnIndex + it]),
    );
  }

  // If row headers we append all row headers following the rowspan.
  if (isRowHeaders && columnIndex !== 0 && matrix?.[rowIndex]?.[columnIndex]?.type !== TYPE_TABLE_CELL_HEADER) {
    [...Array(rowspan)].forEach(
      (_, it) => matrix?.[rowIndex + it]?.[0] && headers.push(matrix?.[rowIndex + it]?.[0] as TableHeaderCellElement),
    );
  }
  return headers
    .map((cell) => cell?.data?.id)
    .filter((cell) => !!cell)
    .join(" ");
};

export const setHeadersOnCell = (matrix: TableMatrix, node: TableElement, path: Path, editor: Editor) => {
  matrix?.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const result = Editor.nodes(editor, {
        at: path,
        match: (node) => equals(node, cell),
      });
      const [maybeNode] = result;

      // If the previous cell in column and row direction is not equal we can normalize the proper cell.
      // Table matrix isn't a direct repsentation of the HTML table so read comments for `getTableAsMatrix`
      if (maybeNode?.[1] && !previousMatrixCellIsEqualCurrent(matrix, rowIndex, cellIndex)) {
        const [_cell, cellPath] = maybeNode;
        const [parent] = Editor.node(editor, Path.parent(Path.parent(cellPath)));
        const headers = !((node.rowHeaders && cellIndex === 0) || rowIndex === 0)
          ? getHeader(matrix, rowIndex, cellIndex, node.rowHeaders)
          : undefined;

        if (isTableHead(parent)) {
          // If first row we add only a double digit id based on the cellIndex
          if (rowIndex === 0 && cell.data.id !== `0${cellIndex}` && cell.type === TYPE_TABLE_CELL_HEADER) {
            updateCell(editor, cell, { id: `0${cellIndex}` }, TYPE_TABLE_CELL_HEADER);
            return true;
          }

          // Second head row need to have a id combined with the previous cell and headers are set to the standard ruleset
          if (
            rowIndex === 1 &&
            matrix?.[1]?.[1]?.type === TYPE_TABLE_CELL_HEADER &&
            (cell.data.id !== `0${cellIndex}1${cellIndex}` || (!!headers && headers !== cell.data.headers))
          ) {
            updateCell(editor, cell, { id: `0${cellIndex}1${cellIndex}`, headers: headers }, TYPE_TABLE_CELL_HEADER);
            return true;
          }
        }
        if (isTableBody(parent)) {
          // If rowheaders need to set ID on the first cell of each row in the body.
          if (node.rowHeaders && cellIndex === 0 && cell.data.id !== `r${rowIndex}`) {
            updateCell(editor, cell, { id: `r${rowIndex}` }, TYPE_TABLE_CELL_HEADER);
            return true;
          }
          // Adds headers to the cell
          if (!!headers && cell.type === TYPE_TABLE_CELL && headers !== cell.data.headers) {
            updateCell(editor, cell, { headers: headers });
            return true;
          }
        }
      }
    });
  });
  return false;
};
