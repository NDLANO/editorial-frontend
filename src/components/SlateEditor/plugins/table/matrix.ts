import { compact } from 'lodash';
import { Descendant, Editor, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableBodyElement, TableCellElement, TableHeadElement, TableMatrix } from './interfaces';
import { defaultTableRowBlock, getTableBodyWidth } from './utils';
import { increaseTableBodyWidth, insertEmptyCells, updateCell } from './slateActions';
import { isTable, isTableHead, isTableRow, isTableCell, isTableBody } from './slateHelpers';
import { getPrevCell } from './matrixHelpers';

/**
 * Insert cellElement into the matrix and the first available column in rowIndex.
 * Example:
 * A cell with rowspan=2 and colspan=4 will be inserted in 8 slots.
 * It will represent the 2x4 area of cells it covers in the html-table.
 */

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

const insertCellInMatrix = (
  matrix: TableMatrix,
  rowIndex: number,
  colspan: number,
  rowspan: number,
  cell: TableCellElement,
) => {
  const rowLength = matrix[rowIndex].length;
  // A. If row has no elements => Place cell at start of the row.
  if (rowLength === 0) {
    insertCellHelper(matrix, cell, rowIndex, rowspan, 0, rowIndex + rowspan);
    return;
  }
  // B. If there are open slots in the row => Place cell at first open slot.
  for (const [colIndex, cell] of matrix[rowIndex].entries()) {
    if (cell) {
      continue;
    } else {
      insertCellHelper(matrix, cell, rowIndex, rowspan, colIndex, colIndex + colspan + rowspan);
      return;
    }
  }
  // C. Otherwise place cell at end of row.
  insertCellHelper(matrix, cell, rowIndex, rowspan, rowLength, rowLength + colspan + rowspan);
};

// Before placing a cell in the table matrix, make sure the cell has the required space
// If not, add the required space by inserting empty cells.
const normalizeCell = (
  editor: Editor,
  matrix: TableMatrix,
  rowIndex: number,
  colspan: number,
  rowspan: number,
) => {
  for (const [colIndex, cell] of matrix[rowIndex].entries()) {
    if (cell) {
      continue;
    } else {
      // The cell should be placed at this index, spanning in both column and row direction.
      // Check that no other cells are blocking the required space.
      for (let r = rowIndex; r < rowIndex + rowspan; r++) {
        for (let c = colIndex; c < colIndex + colspan; c++) {
          if (matrix[r][c]) {
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

// Find the amount of cells in a matrix row.
const countMatrixRowCells = (matrix: TableMatrix, rowIndex: number): number => {
  return compact([...new Set(matrix[rowIndex])]).filter(cell =>
    rowIndex > 0 ? !matrix[rowIndex - 1].includes(cell) : true,
  ).length;
};

// Normalize <tr>. Returns true if normalization occurs.
const normalizeRow = (
  editor: Editor,
  matrix: TableMatrix,
  rowIndex: number,
  tableBody: TableHeadElement | TableBodyElement,
  tableBodyPath: Path,
): boolean => {
  // A. If row does not exist in slate => Insert empty row
  if (!Editor.hasPath(editor, [...tableBodyPath, rowIndex])) {
    Transforms.insertNodes(editor, defaultTableRowBlock(1), {
      at: [...tableBodyPath, rowIndex],
    });
    return true;
  }

  // B. Insert empty cell if missing
  for (const [columnIndex, element] of matrix[rowIndex].entries()) {
    if (!element && columnIndex === 0) {
      const targetPath = [...tableBodyPath, rowIndex, 0];
      insertEmptyCells(editor, targetPath, 1);
      return true;
    }
  }

  // C. Make sure isHeader and scope is set correctly in cells in header and body
  const [table] = Editor.node(editor, Path.parent(tableBodyPath));
  if (isTable(table)) {
    const isHead = isTableHead(tableBody);
    const { rowHeaders } = table;
    // Check every cell of the row to be normalized

    const row = matrix[rowIndex].entries();
    for (const [index, cell] of row) {
      const { scope, isHeader } = cell.data;
      // A. Normalize table head
      if (isHead) {
        // i. If table has row headers.
        //    Make sure scope='col' and isHeader=true
        if (rowHeaders) {
          if (scope !== 'col' || !isHeader) {
            updateCell(editor, cell, {
              scope: rowHeaders ? 'col' : undefined,
              isHeader: true,
            });
            return true;
          }
        } else {
          // ii. If table does not have rowHeaders
          // Make sure cells in header has scope=undefined and isHeader=true
          if (scope || !isHeader) {
            updateCell(editor, cell, {
              scope: undefined,
              isHeader: true,
            });
            return true;
          }
        }
      } else {
        // i. If table does not have headers on rows
        //    Make sure cells in body has scope=undefined and isHeader=false
        if (!rowHeaders && (scope || isHeader)) {
          updateCell(editor, cell, {
            scope: undefined,
            isHeader: false,
          });
          return true;
        }

        // ii. If table has headers on rows
        //    First cell in row should be a header
        //    Other cells should not be a header
        if (rowHeaders) {
          if (index === 0) {
            if (scope !== 'row' || !isHeader) {
              updateCell(editor, cell, {
                scope: 'row',
                isHeader: true,
              });
              return true;
            }
          } else {
            if ((scope || isHeader) && getPrevCell(matrix, rowIndex, index) !== cell) {
              updateCell(editor, cell, {
                scope: undefined,
                isHeader: false,
              });
              return true;
            }
          }
        }
      }
    }
  }

  // D. Compare width of previous and current row and insert empty cells if they are of unequal length.
  if (rowIndex > 0) {
    const lengthDiff = compact(matrix[rowIndex]).length - matrix[rowIndex - 1].length;

    // Previous row is shorter
    if (lengthDiff > 0) {
      const rowEndPath = Path.next([
        ...tableBodyPath,
        rowIndex - 1,
        countMatrixRowCells(matrix, rowIndex - 1) - 1,
      ]);
      insertEmptyCells(editor, rowEndPath, lengthDiff);
      return true;

      // Current row is shorter. Insert empty cells.
    } else if (lengthDiff < 0) {
      const lastCellPath = [...tableBodyPath, rowIndex, countMatrixRowCells(matrix, rowIndex) - 1];

      // In case current row does not exist in Slate, insert an entire row.
      if (!Editor.hasPath(editor, [...tableBodyPath, rowIndex])) {
        Transforms.insertNodes(editor, defaultTableRowBlock(Math.abs(lengthDiff)), {
          at: [...tableBodyPath, rowIndex],
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
export const normalizeTableBodyAsMatrix = (
  editor: Editor,
  tableBody: TableHeadElement | TableBodyElement,
  tableBodyPath: Path,
): boolean => {
  let matrix: TableMatrix = [];

  // Build up a matrix by inserting and normalizing one row at a time
  for (const [rowIndex, row] of tableBody.children.entries()) {
    if (!isTableRow(row)) {
      return false;
    }
    if (!matrix[rowIndex]) {
      matrix[rowIndex] = [];
    }

    // A. Insert all cells in a each row into a matrix. Normalize if needed.
    for (const cell of row.children) {
      if (!isTableCell(cell)) {
        return false;
      }

      const colspan = cell.data.colspan;
      const rowspan = cell.data.rowspan;

      // i. Check if next element can be placed in matrix without needing a normalize.
      // Normalize if needed. This will restart the normalization.
      if (normalizeCell(editor, matrix, rowIndex, colspan, rowspan)) {
        return true;
      }

      // ii. Place cell in matrix
      insertCellInMatrix(matrix, rowIndex, colspan, rowspan, cell);
    }
    // B. Validate insertion of the current row. This will automatically restart the normalization if true.
    if (normalizeRow(editor, matrix, rowIndex, tableBody, tableBodyPath)) {
      return true;
    }
  }

  // B. Rowspan can cause matrix to have more rows than slate. Normalize if needed.
  if (tableBody.children.length < matrix.length) {
    if (normalizeRow(editor, matrix, tableBody.children.length, tableBody, tableBodyPath)) {
      return true;
    }
  }

  // C. Previous header/body can have different width. Add cells if necessary.
  if (Path.hasPrevious(tableBodyPath)) {
    const [previousBody, previousBodyPath] = Editor.node(editor, Path.previous(tableBodyPath));
    if (isTableHead(previousBody) || isTableBody(previousBody)) {
      const previousBodyWidth = getTableBodyWidth(previousBody);
      const currentBodyWidth = getTableBodyWidth(tableBody);

      const widthDiff = currentBodyWidth - previousBodyWidth;

      // i. Previous body is narrower. Add cells in all rows in previous body
      if (widthDiff > 0) {
        increaseTableBodyWidth(editor, previousBody, previousBodyPath, widthDiff);
        return true;
        // ii. Current body is narrower. Add cells to all rows in current body
      } else if (widthDiff < 0) {
        increaseTableBodyWidth(editor, tableBody, tableBodyPath, widthDiff);
        return true;
      }
    }
    // D. Next head/body can have different width. Add cells if necessary.
  } else if (Editor.hasPath(editor, Path.next(tableBodyPath))) {
    const [nextBody, nextBodyPath] = Editor.node(editor, Path.next(tableBodyPath));
    if (isTableHead(nextBody) || isTableBody(nextBody)) {
      const nextBodyWidth = getTableBodyWidth(nextBody);
      const currentBodyWidth = getTableBodyWidth(tableBody);

      const widthDiff = currentBodyWidth - nextBodyWidth;

      // i. First row in next body is narrower. Add cells in that row
      if (widthDiff > 0) {
        const targetRow = nextBody.children[0];
        if (isTableRow(targetRow)) {
          const targetPath = [...nextBodyPath, 0, targetRow.children.length];
          insertEmptyCells(editor, targetPath, widthDiff);
          return true;
        }

        // ii. Current body is narrower. Add cells in all rows
      } else if (widthDiff < 0) {
        increaseTableBodyWidth(editor, tableBody, tableBodyPath, widthDiff);
        return true;
      }
    }
  }

  return false;
};

// Expects a perfectly normalized table. Requires path to the table body
export const getTableBodyAsMatrix = (editor: Editor, path: Path) => {
  if (!Editor.hasPath(editor, path)) return;
  const [tableBody] = Editor.node(editor, path);
  if (!isTableHead(tableBody) && !isTableBody(tableBody)) return;
  let matrix: TableCellElement[][] = [];

  // Build up a matrix one row at a time.
  tableBody.children.forEach((row, rowIndex) => {
    if (!isTableRow(row)) return;
    if (!matrix[rowIndex]) {
      matrix[rowIndex] = [];
    }

    for (const cell of row.children) {
      if (!isTableCell(cell)) return;

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
  if (!isTable(table)) return;
  let matrix: TableMatrix = [];

  // Merge all rows in head and body. Then build up a matrix one row at a time.
  table.children
    .reduce((acc, cur) => {
      if (isTableHead(cur) || isTableBody(cur)) {
        acc.push(...cur.children);
      }
      return acc;
    }, [] as Descendant[])
    .forEach((row, rowIndex) => {
      if (!isTableRow(row)) return;
      if (!matrix[rowIndex]) {
        matrix[rowIndex] = [];
      }

      for (const cell of row.children) {
        if (!isTableCell(cell)) return;

        const colspan = cell.data.colspan;
        const rowspan = cell.data.rowspan;
        insertCellInMatrix(matrix, rowIndex, colspan, rowspan, cell);
      }
    });

  return matrix;
};
