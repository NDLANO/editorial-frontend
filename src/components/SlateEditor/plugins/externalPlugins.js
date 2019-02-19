import EditList from 'ndla-slate-edit-list';
import EditTable from 'ndla-slate-edit-table';

export const listTypes = ['numbered-list', 'bulleted-list', 'letter-list'];

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
