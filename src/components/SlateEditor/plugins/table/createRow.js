import { Range } from 'immutable';
import { Block } from 'slate';
import createCell from './createCell';
import createCellHeader from './createCellHeader';

export default function createRow(columns, textGetter, header = false) {
  if (header) {
    const cellNodes = Range(0, columns)
        .map(i => createCellHeader(textGetter ? textGetter(i) : ''))
        .toList();

    return Block.create({
        type:  'table-row',
        nodes: cellNodes
    });
  }
    const cellNodes = Range(0, columns)
        .map(i => createCell(textGetter ? textGetter(i) : ''))
        .toList();

    return Block.create({
        type:  'table-row',
        nodes: cellNodes
    });
}
