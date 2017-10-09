import { Range } from 'immutable';
import { Block } from 'slate';
import createRow from './createRow';

// const createAlign = require('./createAlign');

export default function createTableBody(columns, rows, textGetter) {
    const rowNodes = Range(0, rows)
        .map(i => createRow(columns, textGetter ? textGetter.bind(null, i) : null))
        .toList();

    return Block.create({
        type:  'table-body',
        nodes: rowNodes,
    });
}
