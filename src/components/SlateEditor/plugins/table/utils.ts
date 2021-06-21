import { Editor, Element } from 'slate';
import { jsx } from 'slate-hyperscript';
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
  return jsx('element', {
    type: TYPE_TABLE_ROW,
  });
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

export const removeRow = (editor: Editor) => {};
