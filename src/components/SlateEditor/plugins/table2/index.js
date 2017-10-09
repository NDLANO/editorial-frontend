
import EditTable from 'slate-edit-table';
import insertTable from './changes/insertTable';

const options = {
    // The type of table blocks
    typeTable: 'table',
    // The type of row blocks
    typeRow: 'table-row',
    // The type of cell blocks
    typeCell: 'table-cell',
    // The type of block inserted when exiting
    exitBlockType: 'paragraph'
};


export default function createTablePlugin() {
  const editTablePlugin = EditTable(options)

  return {
    utils: editTablePlugin.utils,
    changes: {
      ...editTablePlugin.changes,
      insertTable,
    },
  }
}
