import createTable from '../createTable';

export default function insertTable(change, columns = 2, rows = 2) {
    const { state } = change;
    console.log(change)
    if (!state.selection.startKey) return false;

    // Create the table node
    const fillWithEmptyText = () => '';
    const table = createTable(columns, rows, fillWithEmptyText);

    return change
        .insertBlock(table);
}
