import EditList from 'ndla-slate-edit-list';
import DeepTable from 'slate-deep-table';

export const listTypes = ['numbered-list', 'bulleted-list', 'letter-list'];

export const editListPlugin = EditList({
  types: listTypes,
  typeItem: 'list-item',
  typeDefault: 'list-text',
});

const tableOptions = {
  typeRow: 'table-row',
  typeCell: 'table-cell',
};

export const editTablePlugin = DeepTable(tableOptions);
