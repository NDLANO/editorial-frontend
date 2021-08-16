import { compact } from 'lodash';
import { Descendant, Editor, Element, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableBodyElement, TableCellElement, TableHeadElement } from '.';
import {
  defaultTableCellBlock,
  defaultTableRowBlock,
  getTableWidth,
  TYPE_TABLE,
  TYPE_TABLE_BODY,
  TYPE_TABLE_CELL,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_ROW,
} from './utils';

const placeInMatrix = (
  matrix: TableCellElement[][],
  rowIndex: number,
  colspan: number,
  rowspan: number,
  descendant: TableCellElement,
) => {
  const rowLength = matrix[rowIndex].length;
  // If row has no elements, fill from first index.
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
  // If row has empty element, fill from first matching index.
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
  // Otherwise, fill from end of list.
  for (let r = rowIndex; r < rowIndex + rowspan; r++) {
    for (let c = rowLength; c < rowLength + colspan; c++) {
      if (!matrix[r]) {
        matrix[r] = [];
      }
      matrix[r][c] = descendant;
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
            // A cell is blocking required space. Insert the required amount of  cells to push the blocking cell to the right.
            const stepsRight = colIndex + colspan - c;
            const cellPath = ReactEditor.findPath(editor, matrix[r][c]);
            Transforms.insertNodes(
              editor,
              [...Array(stepsRight)].map(() => defaultTableCellBlock()),
              {
                at: cellPath,
              },
            );

            return true;
          }
        }
      }
      return false;
    }
  }
  return false;
};

// Find the index of the last cell path in a row
const findLastCellPath = (matrix: TableCellElement[][], rowIndex: number): number => {
  return (
    compact([...new Set(matrix[rowIndex])]).filter(cell =>
      rowIndex > 0 ? !matrix[rowIndex - 1].includes(cell) : true,
    ).length - 1
  );
};

export const findCellInMatrix = (
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

const normalizeAfterInsert = (
  editor: Editor,
  matrix: TableCellElement[][],
  rowIndex: number,
  tableBodyPath: Path,
) => {
  // Insert  cells if row has empty positions.
  for (const [columnIndex, element] of matrix[rowIndex].entries()) {
    if (!element) {
      if (columnIndex === 0) {
        // TODO: Check if it can be removed
        // Check if cell at first index exists in Slate.
        if (!Editor.hasPath(editor, [...tableBodyPath, rowIndex, 0])) {
          Transforms.insertNodes(editor, defaultTableRowBlock(1), {
            at: [...tableBodyPath, rowIndex],
          });
        } else {
          Transforms.insertNodes(editor, defaultTableCellBlock(), {
            at: [...tableBodyPath, rowIndex, 0],
          });
        }
        return true;
      }
    }
  }

  // Compare width of previous and current row and insert empty cells if they are of unequal length.
  if (rowIndex > 0) {
    const lengthDiff = compact(matrix[rowIndex]).length - matrix[rowIndex - 1].length;
    // Previous row is shorter
    if (lengthDiff > 0) {
      const lastCellPath = [...tableBodyPath, rowIndex - 1, findLastCellPath(matrix, rowIndex - 1)];

      Transforms.insertNodes(
        editor,
        [...Array(lengthDiff)].map(() => defaultTableCellBlock()),
        {
          at: Path.next(lastCellPath),
        },
      );
      return true;
      // Current row is shorter
    } else if (lengthDiff < 0) {
      const lastCellPath = [...tableBodyPath, rowIndex, findLastCellPath(matrix, rowIndex)];

      // TODO: Check if it can be removed
      // In case current row does not exist in Slate, insert an entire row.
      if (!Editor.hasPath(editor, [...tableBodyPath, rowIndex])) {
        Transforms.insertNodes(editor, defaultTableRowBlock(1), {
          at: [...tableBodyPath, rowIndex],
        });

        return true;
      }

      Transforms.insertNodes(
        editor,
        [...Array(Math.abs(lengthDiff))].map(() => defaultTableCellBlock()),
        {
          at: Path.next(lastCellPath),
        },
      );
      return true;
    }
  }
  return false;
};

export const normalizeTableBodyAsMatrix = (
  editor: Editor,
  tableBody: TableHeadElement | TableBodyElement,
  tableBodyPath: Path,
) => {
  let matrix: TableCellElement[][] = [];

  // For each row in slate.
  for (const [rowIndex, row] of tableBody.children.entries()) {
    if (!Element.isElement(row) || row.type !== TYPE_TABLE_ROW) return;
    if (!matrix[rowIndex]) {
      matrix[rowIndex] = [];
    }
    // For each cell in row.
    for (const cell of row.children) {
      if (!Element.isElement(cell) || cell.type !== TYPE_TABLE_CELL) return;

      const colspan = cell.data.colspan ? cell.data.colspan : 1;
      const rowspan = cell.data.rowspan ? cell.data.rowspan : 1;

      // Check if next element can be placed in matrix without needing a normalize.
      // Normalize if needed and start from beginning.
      if (normalizeBeforeInsert(editor, matrix, rowIndex, colspan, rowspan)) {
        return true;
      }
      placeInMatrix(matrix, rowIndex, colspan, rowspan, cell);
    }
    // Validate insertion of the current row. Normalize if needed and start from beginning.
    if (normalizeAfterInsert(editor, matrix, rowIndex, tableBodyPath)) {
      return true;
    }
  }
  // Rowspan can cause matrix to have more rows than slate. Normalize if needed.
  if (tableBody.children.length < matrix.length) {
    if (normalizeAfterInsert(editor, matrix, tableBody.children.length, tableBodyPath)) {
      return true;
    }
  }
  // Previous header/body can have different width. Add cells if necessary.
  if (Path.hasPrevious(tableBodyPath)) {
    const [previousBody, previousBodyPath] = Editor.node(editor, Path.previous(tableBodyPath));
    if (
      Element.isElement(previousBody) &&
      (previousBody.type === TYPE_TABLE_BODY || previousBody.type === TYPE_TABLE_HEAD)
    ) {
      const previousBodyWidth = getTableWidth(previousBody);
      const currentBodyWidth = getTableWidth(tableBody);

      const lengthDiff = currentBodyWidth - previousBodyWidth;

      // Previous body is narrower. Add cells in all rows
      if (lengthDiff > 0) {
        Editor.withoutNormalizing(editor, () => {
          for (const [index, row] of previousBody.children.entries()) {
            if (Element.isElement(row) && row.type === TYPE_TABLE_ROW) {
              Transforms.insertNodes(
                editor,
                [...Array(lengthDiff)].map(() => defaultTableCellBlock()),
                {
                  at: [...previousBodyPath, index, row.children.length],
                },
              );
            }
          }
        });
        return true;
        // Current body is narrower. Add cells in all rows
      } else if (lengthDiff < 0) {
        Editor.withoutNormalizing(editor, () => {
          for (const [index, row] of tableBody.children.entries()) {
            if (Element.isElement(row) && row.type === TYPE_TABLE_ROW) {
              Transforms.insertNodes(
                editor,
                [...Array(Math.abs(lengthDiff))].map(() => defaultTableCellBlock()),
                {
                  at: [...tableBodyPath, index, row.children.length],
                },
              );
            }
          }
        });
        return true;
      }
    }
  }

  return false;
};

export const getTableBodyAsMatrix = (editor: Editor, path: Path) => {
  if (!Editor.hasPath(editor, path)) return;
  const [tableBody] = Editor.node(editor, path);
  if (
    !Element.isElement(tableBody) ||
    (tableBody.type !== TYPE_TABLE_BODY && tableBody.type !== TYPE_TABLE_HEAD)
  )
    return;
  let matrix: TableCellElement[][] = [];

  // Merge table head and body into one list containing every row.
  tableBody.children.forEach((row, rowIndex) => {
    if (!Element.isElement(row) || row.type !== TYPE_TABLE_ROW) return;
    if (!matrix[rowIndex]) {
      matrix[rowIndex] = [];
    }

    for (const cell of row.children) {
      if (!Element.isElement(cell) || cell.type !== TYPE_TABLE_CELL) return;

      const colspan = cell.data.colspan;
      const rowspan = cell.data.rowspan;
      placeInMatrix(matrix, rowIndex, colspan, rowspan, cell);
    }
  });

  return matrix;
};

// Expects a perfectly normalized table. Requires path to the table
export const getTableAsMatrix = (editor: Editor, path: Path) => {
  if (!Editor.hasPath(editor, path)) return;
  const [table] = Editor.node(editor, path);
  if (!Element.isElement(table) || table.type !== TYPE_TABLE) return;
  let matrix: TableCellElement[][] = [];

  // Merge table head and body into one list containing every row.
  table.children
    .reduce((acc, cur) => {
      if (Element.isElement(cur) && [TYPE_TABLE_BODY, TYPE_TABLE_HEAD].includes(cur.type)) {
        acc.push(...cur.children);
      }
      return acc;
    }, [] as Descendant[])
    .forEach((row, rowIndex) => {
      if (!Element.isElement(row) || row.type !== TYPE_TABLE_ROW) return;
      if (!matrix[rowIndex]) {
        matrix[rowIndex] = [];
      }

      for (const cell of row.children) {
        if (!Element.isElement(cell) || cell.type !== TYPE_TABLE_CELL) return;

        const colspan = cell.data.colspan;
        const rowspan = cell.data.rowspan;
        placeInMatrix(matrix, rowIndex, colspan, rowspan, cell);
      }
    });

  return matrix;
};
