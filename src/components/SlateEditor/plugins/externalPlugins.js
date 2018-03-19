import EditBlockquote from 'slate-edit-blockquote';
import EditList from 'slate-edit-list';
import EditTable from 'slate-edit-table';

export const listTypes = [
  'numbered-list',
  'bulleted-list',
  'letter-list',
  'two-column-list',
];

export const blockquotePlugin = EditBlockquote({ type: 'quote' });
export const editListPlugin = EditList({
  types: listTypes,
  typeItem: 'list-item',
  typeDefault: 'list-text',
});

const tableOptions = {
  typeTable: 'table',
  typeRow: 'table-row',
  typeCell: 'table-cell',
  exitBlockType: 'paragraph',
};

export const editTablePlugin = EditTable(tableOptions);
