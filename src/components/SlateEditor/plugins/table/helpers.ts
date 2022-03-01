import { Editor, Element, Node, Path, Transforms } from 'slate';
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
import { defaultTableCellBlock } from './utils';

// Checks
export const isTable = (node: Node): node is TableElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE;
};

export const isTableCaption = (node: Node): node is TableCaptionElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE_CAPTION;
};
export const isTableHead = (node: Node): node is TableHeadElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE_HEAD;
};

export const isTableBody = (node: Node): node is TableBodyElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE_BODY;
};

export const isTableRow = (node: Node): node is TableRowElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE_ROW;
};

export const isTableCell = (node: Node): node is TableCellElement => {
  return Element.isElement(node) && node.type === TYPE_TABLE_CELL;
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
