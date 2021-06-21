import { Editor, Element, Path, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { ReactEditor } from 'slate-react';
import { TableElement, TableRowElement } from '.';
import { defaultParagraphBlock } from '../paragraph/utils';

export const TYPE_TABLE = 'table';
export const TYPE_TABLE_ROW = 'table-row';
export const TYPE_TABLE_CELL = 'table-cell';

export const countCells = (row: TableRowElement) => {
  return row.children
    .map(child => {
      if (!Element.isElement(child) || child.type !== TYPE_TABLE_CELL) {
        return 0;
      }
      return child.data.colspan ? parseInt(child.data.colspan) : 1;
    })
    .reduce((a, b) => a + b);
};

export const defaultTableCellBlock = () => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_CELL,
      data: { colspan: '1', rowspan: '1', isHeader: 'false' },
    },
    defaultParagraphBlock(),
  );
};

export const defaultTableRowBlock = () => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_ROW,
    },
    defaultTableCellBlock(),
  );
};

export const getTableWidth = (element: TableElement) => {
  const firstRow = element.children[0];
  if (Element.isElement(firstRow) && firstRow.type === TYPE_TABLE_ROW) {
    return firstRow.children.length;
  }
  return null;
};

export const getTableHeight = (element: TableElement) => {
  return element.children.length;
};

export const removeRow = (editor: Editor, path: Path) => {
  const [rowEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_ROW,
  });
  const rowPath = rowEntry && rowEntry[1];
  Transforms.removeNodes(editor, {
    at: rowPath,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_ROW,
  });
};

export const insertRow = (editor: Editor, path: Path) => {
  const [rowEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_ROW,
  });
  const rowPath = rowEntry && rowEntry[1];
  Transforms.insertNodes(editor, defaultTableRowBlock(), { at: Path.next(rowPath) });
};

export const insertColumn = (editor: Editor, tableElement: TableElement, path: Path) => {
  const [columnEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const columnPath = columnEntry && columnEntry[1];
  const targetColumn = columnPath[columnPath.length - 1] + 1;

  Editor.withoutNormalizing(editor, () => {
    tableElement.children.forEach((row, index) => {
      Transforms.insertNodes(editor, defaultTableCellBlock(), {
        at: [...ReactEditor.findPath(editor, tableElement), index, targetColumn],
      });
    });
    Transforms.select(editor, {
      anchor: { offset: 0, path: [...Path.next(columnPath), 0, 0] },
      focus: { offset: 0, path: [...Path.next(columnPath), 0, 0] },
    });
  });
};

export const removeColumn = (editor: Editor, tableElement: TableElement, path: Path) => {
  const firstRow = tableElement.children[0];

  if (
    !Element.isElement(firstRow) ||
    firstRow.type !== TYPE_TABLE_ROW ||
    firstRow.children.length < 2
  ) {
    return;
  }
  const [columnEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const columnPath = columnEntry && columnEntry[1];
  const targetColumn = columnPath[columnPath.length - 1];

  Editor.withoutNormalizing(editor, () => {
    tableElement.children.forEach((row, index) => {
      Transforms.removeNodes(editor, {
        at: [...ReactEditor.findPath(editor, tableElement), index, targetColumn],
        match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
      });
    });
  });
};

export const removeTable = (editor: Editor, path: Path) => {
  Transforms.removeNodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE,
  });
};
