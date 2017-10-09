import { Block } from 'slate';
import createTableBody from './createTableBody';
import createTableHeaderSection from './createTableHeaderSection';

// const createAlign =
export default function createTable(columns, rows, textGetter) {
  const tableBody = [
    createTableHeaderSection(
      columns,
      rows,
      textGetter ? textGetter.bind(null, 0) : null,
    ),
    createTableBody(
      columns,
      rows,
      textGetter ? textGetter.bind(null, 1) : null,
    ),
  ];
  const align = {};

  return Block.create({
    type: 'table',
    nodes: tableBody,
    data: {
      align,
    },
  });
}
