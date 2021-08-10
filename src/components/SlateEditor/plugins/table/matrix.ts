import { Editor, Element, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableCellElement, TableElement } from '.';
import { defaultTableCellBlock, TYPE_TABLE, TYPE_TABLE_CELL, TYPE_TABLE_ROW } from './utils';

const placeInMatrix = (
  matrix: TableCellElement[][],
  rowIndex: number,
  colspan: number,
  rowspan: number,
  descendant: TableCellElement,
) => {
  const rowLength = matrix[rowIndex].length;
  if (rowLength === 0) {
    for (let r = rowIndex; r < rowIndex + rowspan; r++) {
      for (let c = 0; c < colspan; c++) {
        if (!matrix[r]) {
          matrix[r] = [];
        }
        matrix[r][c] = descendant;
      }
    }
    return;
  }
  for (const [colIndex, cell] of matrix[rowIndex].entries()) {
    if (cell) {
      continue;
    } else {
      for (let r = rowIndex; r < rowIndex + rowspan; r++) {
        for (let c = colIndex; c < colIndex + colspan; c++) {
          if (!matrix[r]) {
            matrix[r] = [];
          }
          matrix[r][c] = descendant;
        }
      }
      return;
    }
  }
  for (let r = rowIndex; r < rowIndex + rowspan; r++) {
    for (let c = rowLength; c < rowLength + colspan; c++) {
      if (!matrix[r]) {
        matrix[r] = [];
      }
      matrix[r][c] = descendant;
    }
  }
};

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
      for (let r = rowIndex; r < rowIndex + rowspan; r++) {
        for (let c = colIndex; c < colIndex + colspan; c++) {
          if (matrix[r][c]) {
            // A cell has already occupied this space. Push cell the required amount of steps to the right.
            const stepsRight = colIndex + colspan - c;
            const cellPath = ReactEditor.findPath(editor, matrix[r][c]);
            Transforms.insertNodes(editor, [...Array(stepsRight)].fill(defaultTableCellBlock()), {
              at: cellPath,
            });

            return true;
          }
        }
      }
      return false;
    }
  }
  return false;
};

const findLastCellPath = (matrix: TableCellElement[][], rowIndex: number) => {
  return (
    [...new Set(matrix[rowIndex])].filter(cell =>
      rowIndex > 0 ? !matrix[rowIndex - 1].includes(cell) : true,
    ).length - 1
  );
};

const normalizeAfterInsert = (
  editor: Editor,
  matrix: TableCellElement[][],
  rowIndex: number,
  tablePath: Path,
) => {
  for (const [columnIndex, element] of matrix[rowIndex].entries()) {
    // Matrix is empty.
    if (!element) {
      if (columnIndex === 0) {
        Transforms.insertNodes(editor, defaultTableCellBlock(), { at: [...tablePath, 0] });
        return true;
      } else {
        const prevElementPath = ReactEditor.findPath(editor, matrix[rowIndex][columnIndex - 1]);

        Transforms.insertNodes(editor, defaultTableCellBlock(), { at: Path.next(prevElementPath) });
        return true;
      }
    }
  }

  if (rowIndex > 0) {
    const lengthDiff = matrix[rowIndex].length - matrix[rowIndex - 1].length;
    // Previous row is shorter
    if (lengthDiff > 0) {
      const lastCellPath = [...tablePath, rowIndex - 1, findLastCellPath(matrix, rowIndex - 1)];

      Transforms.insertNodes(editor, [...Array(lengthDiff)].fill(defaultTableCellBlock()), {
        at: Path.next(lastCellPath),
      });
      return true;
      // Current row is shorter
    } else if (lengthDiff < 0) {
      const lastCellPath = [...tablePath, rowIndex, findLastCellPath(matrix, rowIndex)];

      Transforms.insertNodes(
        editor,
        [...Array(Math.abs(lengthDiff))].fill(defaultTableCellBlock()),
        {
          at: Path.next(lastCellPath),
        },
      );
      return true;
    }
  }
  return false;
};
export const normalizeTableAsMatrix = (editor: Editor, table: TableElement, tablePath: Path) => {
  let matrix: TableCellElement[][] = [];

  for (const [rowIndex, row] of table.children.entries()) {
    if (!Element.isElement(row) || row.type !== TYPE_TABLE_ROW) return;
    if (!matrix[rowIndex]) {
      matrix[rowIndex] = [];
    }
    for (const cell of row.children) {
      if (!Element.isElement(cell) || cell.type !== TYPE_TABLE_CELL) return;

      const colspan = cell.data.colspan ? parseInt(cell.data.colspan) : 1;
      const rowspan = cell.data.rowspan ? parseInt(cell.data.rowspan) : 1;
      // Check if next element can be placed in matrix without needing a normalize.
      // Normalize if needed and start from beginning.
      if (normalizeBeforeInsert(editor, matrix, rowIndex, colspan, rowspan)) {
        return true;
      }
      placeInMatrix(matrix, rowIndex, colspan, rowspan, cell);
    }
    // Validate insertion of the current row. Normalize if needed and start from beginning.
    if (normalizeAfterInsert(editor, matrix, rowIndex, tablePath)) {
      return true;
    }
  }
  return false;
};

// Expects a perfectly normalized table.
export const getTableAsMatrix = (editor: Editor, path: Path) => {
  if (!Editor.hasPath(editor, path)) return;
  const [table] = Editor.node(editor, path);
  if (!Element.isElement(table) || table.type !== TYPE_TABLE) return;
  let matrix: TableCellElement[][] = [];

  table.children.forEach((row, rowIndex) => {
    if (!Element.isElement(row) || row.type !== TYPE_TABLE_ROW) return;
    if (!matrix[rowIndex]) {
      matrix[rowIndex] = [];
    }

    for (const cell of row.children) {
      if (!Element.isElement(cell) || cell.type !== TYPE_TABLE_CELL) return;

      const colspan = cell.data.colspan ? parseInt(cell.data.colspan) : 1;
      const rowspan = cell.data.rowspan ? parseInt(cell.data.rowspan) : 1;
      placeInMatrix(matrix, rowIndex, colspan, rowspan, cell);
    }
  });
};
