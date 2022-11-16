import { Editor, Element, Node, Path, Transforms } from 'slate';
import {
  TableBodyElement,
  TableCaptionElement,
  TableCellElement,
  TableElement,
  TableHeadElement,
  TableMatrix,
  TableRowElement,
} from './interfaces';
import {
  TYPE_TABLE,
  TYPE_TABLE_BODY,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE_CELL,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_ROW,
} from './types';
import { defaultTableCellBlock } from './utils';

// Checks
export const isTable = (node?: Node): node is TableElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE;
};

export const isTableCaption = (node?: Node): node is TableCaptionElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE_CAPTION;
};
export const isTableHead = (node?: Node): node is TableHeadElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE_HEAD;
};

export const isTableBody = (node?: Node): node is TableBodyElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE_BODY;
};

export const isTableRow = (node?: Node): node is TableRowElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE_ROW;
};

export const isTableCell = (node?: Node): node is TableCellElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE_CELL;
};

export const hasCellAlignOfType = (editor: Editor, type: string) => {
  // For all selected table cells
  for (const [cell] of Editor.nodes<TableCellElement>(editor, {
    match: node => isTableCell(node),
  })) {
    if (cell.data.align === type) {
      return true;
    }
  }
  return false;
};

// Transforms
export const insertEmptyCells = (editor: Editor, path: Path, amount: number) => {
  Transforms.insertNodes(
    editor,
    [...Array(amount)].map(() => defaultTableCellBlock()),
    {
      at: path,
    },
  );
};

export const toggleCellAlign = (editor: Editor, type: string) => {
  const newAlign = hasCellAlignOfType(editor, type) ? undefined : type;

  Editor.withoutNormalizing(editor, () => {
    for (const [cell] of Editor.nodes<TableCellElement>(editor, {
      match: node => isTableCell(node),
    })) {
      Transforms.setNodes(
        editor,
        {
          ...cell,
          data: {
            ...cell.data,
            align: newAlign,
          },
        },
        { match: node => node === cell },
      );
    }
  });
};

export const updateCell = (
  editor: Editor,
  cell: TableCellElement,
  data: Partial<TableCellElement['data']>,
) => {
  Transforms.setNodes(
    editor,
    {
      ...cell,
      data: {
        ...cell.data,
        ...data,
      },
    },
    {
      match: node => node === cell,
      // If performance is low, send in path of table, row or cell to narrow the search.
      at: [],
    },
  );
};

// Getters
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
