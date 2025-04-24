/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Path } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { defaultTableCellBlock } from "./defaultBlocks";
import { TableBodyElement, TableCellElement, TableHeadElement, TableRowElement } from "./interfaces";
import { TYPE_TABLE_CELL_HEADER, TYPE_TABLE_ROW } from "./types";
import { isAnyTableCellElement, isTableRowElement } from "./queries";

export const hasCellAlignOfType = (editor: Editor, type: string) => {
  // For all selected table cells
  for (const [cell] of Editor.nodes<TableCellElement>(editor, {
    match: isAnyTableCellElement,
  })) {
    if (cell.data.align === type) {
      return true;
    }
  }
  return false;
};

export const countCells = (row: TableRowElement, stop?: number) => {
  return row.children
    .map((child) => {
      if (!isAnyTableCellElement(child)) {
        return 0;
      }
      return child.data.colspan;
    })
    .slice(0, stop)
    .reduce((a, b) => a + b);
};

export const getTableBodyWidth = (element: TableHeadElement | TableBodyElement) => {
  const firstRow = element.children[0];
  if (isTableRowElement(firstRow)) {
    return countCells(firstRow);
  }
  return 0;
};

export const createIdenticalRow = (element: TableRowElement) => {
  return slatejsx(
    "element",
    { type: TYPE_TABLE_ROW },
    element.children.map((child) => {
      if (isAnyTableCellElement(child)) {
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

export const isInTableCellHeader = (editor: Editor, path?: Path) => {
  if (path) {
    const [parent] = Editor.parent(editor, path);
    return Element.isElement(parent) && parent.type === TYPE_TABLE_CELL_HEADER;
  }
  return false;
};
