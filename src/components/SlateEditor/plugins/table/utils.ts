import { Element } from 'slate';
import { jsx } from 'slate-hyperscript';
import { TableRowElement } from '.';
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
