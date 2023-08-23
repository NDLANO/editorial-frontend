/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { Descendant } from 'slate';

export interface TableElement {
  type: 'table';
  colgroups: string;
  rowHeaders: boolean;
  children: Descendant[];
}

export interface TableCaptionElement {
  type: 'table-caption';
  children: Descendant[];
}

export interface TableHeadElement {
  type: 'table-head';
  children: Descendant[];
}

export interface TableBodyElement {
  type: 'table-body';
  children: Descendant[];
}

export interface TableRowElement {
  type: 'table-row';
  children: Descendant[];
}

export interface TableCellElement {
  type: 'table-cell' | 'table-cell-header';
  data: TableCellData;
  children: Descendant[];
}

interface TableCellData {
  id?: string;
  rowspan: number;
  colspan: number;
  align?: string;
  valign?: string;
  class?: string;
  headers?: string;
  isHeader?: boolean;
  scope?: 'row' | 'col';
  isNum?: boolean;
}

export type TableMatrix = TableCellElement[][];
