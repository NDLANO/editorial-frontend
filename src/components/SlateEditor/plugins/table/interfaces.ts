import { Descendant } from 'slate';

export interface TableElement {
  type: 'table';
  colgroups: string;
  verticalHeaders: boolean;
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
  type: 'table-cell';
  data: {
    rowspan: number;
    colspan: number;
    align?: string;
    valign?: string;
    class?: string;
    isHeader: boolean;
    scope?: 'row' | 'col';
  };
  children: Descendant[];
}
