import { compact } from 'lodash';
import { Descendant, Editor, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableBodyElement, TableCellElement, TableHeadElement } from '.';
import getCurrentBlock from '../../utils/getCurrentBlock';
import {
  insertEmptyCells,
  isTable,
  isTableBody,
  isTableCell,
  isTableHead,
  isTableRow,
} from './helpers';
import { defaultTableRowBlock, getTableBodyWidth, TYPE_TABLE } from './utils';

/**
 * Insert cellElement into the matrix and the first available column in rowIndex.
 * Example:
 * A cell with rowspan=2 and colspan=4 will be inserted in 8 slots.
 * It will represent the 2x4 area of cells it covers in the html-table.
 */
const placeCellInMatrix = (
  matrix: TableCellElement[][],
  rowIndex: number,
  colspan: number,
  rowspan: number,
  cellElement: TableCellElement,
) => {
  const rowLength = matrix[rowIndex].length;
  // A. If row has no elements => Place cell at start of the row.
  if (rowLength === 0) {
    for (let r = rowIndex; r < rowIndex + rowspan; r++) {
      for (let c = 0; c < colspan; c++) {
        if (!matrix[r]) {
          matrix[r] = [];
        }
        matrix[r][c] = cellElement;
      }
    }
    return;
  }
  // B. If there are open slots in the row => Place cell at first open slot.
  for (const [colIndex, cell] of matrix[rowIndex].entries()) {
    if (cell) {
      continue;
    } else {
      for (let r = rowIndex; r < rowIndex + rowspan; r++) {
        for (let c = colIndex; c < colIndex + colspan; c++) {
          if (!matrix[r]) {
            matrix[r] = [];
          }
          matrix[r][c] = cellElement;
        }
      }
      return;
    }
  }
  // C. Otherwise place cell at end of row.
  for (let r = rowIndex; r < rowIndex + rowspan; r++) {
    for (let c = rowLength; c < rowLength + colspan; c++) {
      if (!matrix[r]) {
        matrix[r] = [];
      }
      matrix[r][c] = cellElement;
    }
  }
};

// Before placing a cell in the table matrix, make sure the cell has the required space
// If not, add the required space by inserting empty cells.
const normalizeBeforeInsert = (
  editor: Editor,
  matrix: TableCellElement[][],
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
const countMatrixRowCells = (matrix: TableCellElement[][], rowIndex: number): number => {
  return compact([...new Set(matrix[rowIndex])]).filter(cell =>
    rowIndex > 0 ? !matrix[rowIndex - 1].includes(cell) : true,
  ).length;
};

// Find the matrix coordinates for a cell. Returns the coordinates for top left corner of cell.
export const findCellCoordinate = (
  matrix: TableCellElement[][],
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

const normalizeRow = (
  editor: Editor,
  matrix: TableCellElement[][],
  rowIndex: number,
  tableBody: TableHeadElement | TableBodyElement,
  tableBodyPath: Path,
) => {
  const [table] = getCurrentBlock(editor, TYPE_TABLE);

  // A. If row does not exist in slate => Insert empty row
  if (!Editor.hasPath(editor, [...tableBodyPath, rowIndex])) {
    Transforms.insertNodes(editor, defaultTableRowBlock(1), {
      at: [...tableBodyPath, rowIndex],
    });
    return;
  }

  // B. Insert cells if row has empty positions.
  for (const [columnIndex, element] of matrix[rowIndex].entries()) {
    // i. Check if cell at first index exists in Slate.
    if (!element) {
      if (columnIndex === 0) {
        // If path does not exist. Insert empty row.
        const targetPath = [...tableBodyPath, rowIndex, 0];
        insertEmptyCells(editor, targetPath, 1);
        return true;
      }
    }
  }

  // C. Make sure isHeader and scope is set correctly in cells in header and body
  if (table && isTable(table)) {
    const isHead = isTableHead(tableBody);
    const { verticalHeaders } = table;
    // Check every cell of the row to be normalized
    for (const [index, cell] of matrix[rowIndex].entries()) {
      // A. Normalize table head
      if (isHead) {
        // i. If table has vertical headers.
        //    Make sure scope='col' and isHeader=true
        if (verticalHeaders) {
          if (cell.data.scope !== 'col' || !cell.data.isHeader) {
            return Transforms.setNodes(
              editor,
              {
                ...cell,
                data: {
                  ...cell.data,
                  scope: verticalHeaders ? 'col' : undefined,
                  isHeader: true,
                },
              },
              {
                at: [...tableBodyPath, rowIndex],
                match: isTableCell,
                mode: 'lowest',
              },
            );
          }
        } else {
          // ii. If table does not have vertical headers
          //     Make sure cells in header has scope=undefined and isHeader=true
          if (cell.data.scope || !cell.data.isHeader) {
            return Transforms.setNodes(
              editor,
              {
                ...cell,
                data: {
                  ...cell.data,
                  scope: undefined,
                  isHeader: true,
                },
              },
              {
                at: [...tableBodyPath, rowIndex],
                match: isTableCell,
                mode: 'lowest',
              },
            );
          }
        }
      } else {
        // i. If table has vertical headers
        //    First cell in row should be a header
        if (verticalHeaders) {
          if (index === 0 && (cell.data.scope !== 'row' || !cell.data.isHeader)) {
            return Transforms.setNodes(
              editor,
              {
                ...cell,
                data: {
                  ...cell.data,
                  scope: 'row',
                  isHeader: true,
                },
              },
              {
                at: ReactEditor.findPath(editor, cell),
              },
            );
          }
        } else {
          // ii. If table does not have vertical headers
          //     Make sure cells in body has scope=undefined and isHeader=false
          if (cell.data.scope || cell.data.isHeader) {
            return Transforms.setNodes(
              editor,
              {
                ...cell,
                data: {
                  ...cell.data,
                  scope: undefined,
                  isHeader: false,
                },
              },
              {
                at: [...tableBodyPath, rowIndex],
                match: isTableCell,
                mode: 'lowest',
              },
            );
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
      const targetPath = Path.next([
        ...tableBodyPath,
        rowIndex - 1,
        countMatrixRowCells(matrix, rowIndex - 1) - 1,
      ]);
      insertEmptyCells(editor, targetPath, lengthDiff);
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
  let matrix: TableCellElement[][] = [];

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
      if (normalizeBeforeInsert(editor, matrix, rowIndex, colspan, rowspan)) {
        return true;
      }

      // ii. Place cell in matrix
      placeCellInMatrix(matrix, rowIndex, colspan, rowspan, cell);
    }
    // B. Validate insertion of the current row. This will restart the normalization.
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

      // i. Previous body is narrower. Add cells in all rows
      if (widthDiff > 0) {
        Editor.withoutNormalizing(editor, () => {
          for (const [index, row] of previousBody.children.entries()) {
            if (isTableRow(row)) {
              const targetPath = [...previousBodyPath, index, row.children.length];
              insertEmptyCells(editor, targetPath, widthDiff);
            }
          }
        });
        return true;
        // ii. Current body is narrower. Add cells at end of all rows
      } else if (widthDiff < 0) {
        Editor.withoutNormalizing(editor, () => {
          for (const [index, row] of tableBody.children.entries()) {
            if (isTableRow(row)) {
              const targetPath = [...tableBodyPath, index, row.children.length];
              insertEmptyCells(editor, targetPath, Math.abs(widthDiff));
            }
          }
        });
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
        Editor.withoutNormalizing(editor, () => {
          for (const [index, row] of tableBody.children.entries()) {
            if (isTableRow(row)) {
              const targetPath = [...tableBodyPath, index, row.children.length];
              insertEmptyCells(editor, targetPath, Math.abs(widthDiff));
            }
          }
        });
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
      placeCellInMatrix(matrix, rowIndex, colspan, rowspan, cell);
    }
  });

  return matrix;
};

// Expects a perfectly normalized table. Requires path to the table
export const getTableAsMatrix = (editor: Editor, path: Path) => {
  if (!Editor.hasPath(editor, path)) return;
  const [table] = Editor.node(editor, path);
  if (!isTable(table)) return;
  let matrix: TableCellElement[][] = [];

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
        placeCellInMatrix(matrix, rowIndex, colspan, rowspan, cell);
      }
    });

  return matrix;
};
