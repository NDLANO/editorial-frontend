/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Path } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { defaultTableCellBlock } from "./defaultBlocks";
import { TableBodyElement, TableHeadElement, TableRowElement } from "./interfaces";
import { TABLE_ROW_ELEMENT_TYPE } from "./types";
import { isAnyTableCellElement, isTableCellHeaderElement, isTableRowElement } from "./queries";

export const hasCellAlignOfType = (editor: Editor, type: string) => {
  const [cell] = Editor.nodes(editor, { match: (n) => isAnyTableCellElement(n) && n.data.align === type });
  return !!cell;
};

export const countCells = (row: TableRowElement) => {
  return row.children.reduce((acc, child) => {
    if (!isAnyTableCellElement(child)) {
      return acc;
    }
    return acc + child.data.colspan;
  }, 0);
};

export const getTableBodyWidth = (element: TableHeadElement | TableBodyElement) => {
  const firstRow = element.children[0];
  if (isTableRowElement(firstRow)) {
    return countCells(firstRow);
  }
  return 0;
};

export const createIdenticalRow = (element: TableRowElement) => {
  const newChildren = element.children.map((child) => {
    if (!isAnyTableCellElement(child)) return defaultTableCellBlock();
    return { ...defaultTableCellBlock(), data: { ...child.data, rowspan: 1 } };
  });
  return slatejsx("element", { type: TABLE_ROW_ELEMENT_TYPE }, newChildren);
};

export const isInTableCellHeader = (editor: Editor, path?: Path) => {
  return path ? isTableCellHeaderElement(Editor.parent(editor, path)?.[0]) : false;
};
