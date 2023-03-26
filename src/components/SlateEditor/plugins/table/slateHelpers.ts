/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { Editor, Element, Node } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { defaultTableCellBlock } from './defaultBlocks';
import {
  TableBodyElement,
  TableCaptionElement,
  TableCellElement,
  TableElement,
  TableHeadElement,
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

export const countCells = (row: TableRowElement, stop?: number) => {
  return row.children
    .map(child => {
      if (!isTableCell(child)) {
        return 0;
      }
      return child.data.colspan;
    })
    .slice(0, stop)
    .reduce((a, b) => a + b);
};

export const getTableBodyWidth = (element: TableHeadElement | TableBodyElement) => {
  const firstRow = element.children[0];
  if (isTableRow(firstRow)) {
    return countCells(firstRow);
  }
  return 0;
};

export const getTableBodyHeight = (element: TableHeadElement | TableBodyElement) => {
  return element.children.length;
};

export const createIdenticalRow = (element: TableRowElement) => {
  return slatejsx(
    'element',
    { type: TYPE_TABLE_ROW },
    element.children.map(child => {
      if (isTableCell(child)) {
        return {
          ...defaultTableCellBlock(),
          data: {
            ...child.data,
            rowspan: 1,
          },
        };
      }
      return defaultTableCellBlock();
    }),
  );
};
