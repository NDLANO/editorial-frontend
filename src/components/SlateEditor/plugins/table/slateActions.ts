import { Editor, Path, Transforms } from 'slate';
import { TableBodyElement, TableCellElement, TableHeadElement } from './interfaces';
import { hasCellAlignOfType, isTableCell, isTableRow } from './slateHelpers';
import { defaultTableCellBlock } from './utils';

export const insertEmptyCells = (editor: Editor, path: Path, amount: number) => {
  Transforms.insertNodes(
    editor,
    [...Array(amount)].map(() => defaultTableCellBlock()),
    {
      at: path,
    },
  );
};

export const increaseTableBodyWidth = (
  editor: Editor,
  body: TableBodyElement | TableHeadElement,
  path: Path,
  amount: number,
) => {
  Editor.withoutNormalizing(editor, () => {
    for (const [index, row] of body.children.entries()) {
      if (isTableRow(row)) {
        const targetPath = [...path, index, row.children.length];
        insertEmptyCells(editor, targetPath, Math.abs(amount));
      }
    }
  });
};

export const toggleCellAlign = (editor: Editor, type: string) => {
  const newAlign = hasCellAlignOfType(editor, type) ? undefined : type;

  Editor.withoutNormalizing(editor, () => {
    for (const [cell] of Editor.nodes<TableCellElement>(editor, {
      match: node => isTableCell(node),
    })) {
      updateCell(editor, cell, { align: newAlign });
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
      // If performance is slow, send in path of table, row or cell to narrow the search.
      at: [],
    },
  );
};
