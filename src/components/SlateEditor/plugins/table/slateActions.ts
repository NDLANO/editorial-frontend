/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { Editor, Path, Transforms } from 'slate';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { defaultTableCellBlock } from './defaultBlocks';
import { TableBodyElement, TableCellElement, TableElement, TableHeadElement } from './interfaces';
import { getTableAsMatrix } from './matrix';
import { findCellCoordinate, getMatrixColumn } from './matrixHelpers';
import { hasCellAlignOfType, isTableCell, isTableRow } from './slateHelpers';
import { TYPE_TABLE_CELL } from './types';

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
      match: (node) => isTableCell(node),
    })) {
      updateCell(editor, cell, { align: newAlign });
    }
  });
};

export const updateCell = (
  editor: Editor,
  cell: TableCellElement,
  data: Partial<TableCellElement['data']>,
  cellType?: TableCellElement['type'],
) => {
  Transforms.setNodes(
    editor,
    {
      ...cell,
      type: cellType ?? cell.type,
      data: {
        ...cell.data,
        ...data,
      },
    },
    {
      match: (node) => node === cell,
      // If performance is slow, send in path of table, row or cell to narrow the search.
      at: [],
    },
  );
};

export const alignColumn = (editor: Editor, tablePath: Path, align: string) => {
  const cellElement = getCurrentBlock(editor, TYPE_TABLE_CELL)?.[0];

  if (!isTableCell(cellElement)) {
    return;
  }

  const matrix = getTableAsMatrix(editor, tablePath);

  if (!matrix) {
    return;
  }

  const currentPosition = findCellCoordinate(matrix, cellElement);

  if (currentPosition) {
    const column = getMatrixColumn(matrix, currentPosition[1]);
    Editor.withoutNormalizing(editor, () => {
      column.forEach((cell) => {
        updateCell(editor, cell, {
          align: align === 'left' ? undefined : align,
        });
      });
    });
  }
};

export const removeTable = (editor: Editor, element: TableElement) => {
  Transforms.removeNodes(editor, {
    at: [],
    match: (node) => node === element,
  });
};
