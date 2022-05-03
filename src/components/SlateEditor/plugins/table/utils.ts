import { Editor, Element, Path, Transforms } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { ReactEditor } from 'slate-react';
import {
  TableElement,
  TableRowElement,
  TableHeadElement,
  TableBodyElement,
  TableCellElement,
  TableCaptionElement,
} from './interfaces';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { defaultParagraphBlock } from '../paragraph/utils';
import { isTable, isTableBody, isTableCell, isTableHead, isTableRow } from './helpers';
import { findCellCoordinate, getTableAsMatrix, getTableBodyAsMatrix } from './matrix';
import {
  TYPE_TABLE,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE_CELL,
  TYPE_TABLE_ROW,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_BODY,
} from './types';

export const countCells = (row: TableRowElement, stop?: number) => {
  return row.children
    .map(child => {
      if (!isTableCell(child)) {
        return 0;
      }
      return child.data.colspan;
    })
    .slice(0, stop)
    .reduce((a, b) => a + b);
};

export const defaultTableBlock = (height: number, width: number) => {
  return slatejsx('element', { type: TYPE_TABLE, colgroups: '' }, [
    defaultTableCaptionBlock(),
    defaultTableHeadBlock(width),
    defaultTableBodyBlock(height - 1, width),
  ]) as TableElement;
};

export const defaultTableCaptionBlock = () => {
  return slatejsx('element', { type: TYPE_TABLE_CAPTION }, [{ text: '' }]) as TableCaptionElement;
};

export const defaultTableCellBlock = () => {
  return slatejsx(
    'element',
    {
      type: TYPE_TABLE_CELL,
      data: {
        isHeader: false,
        colspan: 1,
        rowspan: 1,
      },
    },
    {
      ...defaultParagraphBlock(),
      serializeAsText: true,
    },
  ) as TableCellElement;
};

export const defaultTableRowBlock = (width: number) => {
  return slatejsx(
    'element',
    {
      type: TYPE_TABLE_ROW,
    },
    [...Array(width)].map(() => defaultTableCellBlock()),
  );
};

export const defaultTableHeadBlock = (width: number) => {
  return slatejsx(
    'element',
    {
      type: TYPE_TABLE_HEAD,
    },
    defaultTableRowBlock(width),
  );
};

export const defaultTableBodyBlock = (height: number, width: number) => {
  return slatejsx(
    'element',
    {
      type: TYPE_TABLE_BODY,
    },
    [...Array(height)].map(() => defaultTableRowBlock(width)),
  );
};

export const getTableBodyWidth = (element: TableHeadElement | TableBodyElement) => {
  const firstRow = element.children[0];
  if (isTableRow(firstRow)) {
    return countCells(firstRow);
  }
  return 0;
};

export const getTableBodyHeight = (element: TableHeadElement | TableBodyElement) => {
  return element.children.length;
};

export const createIdenticalRow = (element: TableRowElement) => {
  return slatejsx(
    'element',
    { type: TYPE_TABLE_ROW },
    element.children.map(child => {
      if (isTableCell(child)) {
        return {
          ...defaultTableCellBlock(),
          data: {
            ...child.data,
            rowspan: 1,
          },
        };
      }
      return defaultTableCellBlock();
    }),
  );
};

export const toggleRowHeaders = (editor: Editor, path: Path) => {
  const [table] = Editor.node(editor, path);
  if (isTable(table)) {
    Transforms.setNodes(
      editor,
      { rowHeaders: !table.rowHeaders },
      {
        at: path,
      },
    );
  }
};

export const editColgroups = (editor: Editor, path: Path) => {
  const [table] = Editor.node(editor, path);
  if (isTable(table)) {
    Transforms.setNodes(
      editor,
      { showEditColgroups: true },
      {
        at: path,
      },
    );
  }
};

export const removeRow = (editor: Editor, path: Path) => {
  const [tableBodyEntry] = Editor.nodes(editor, {
    at: path,
    match: node => isTableHead(node) || isTableBody(node),
  });

  if (!tableBodyEntry) {
    return;
  }

  const [tableBody, tableBodyPath] = tableBodyEntry;

  // If tableHead only contains one row. Remove it.
  if (isTableHead(tableBody)) {
    if (tableBody.children.length === 1) {
      return Transforms.removeNodes(editor, { at: tableBodyPath });
    }
  }

  if (isTableBody(tableBody)) {
    if (tableBody.children.length === 1) {
      return;
    }
  }

  const [cellEntry] = Editor.nodes(editor, {
    at: path,
    match: node => isTableCell(node),
  });
  const [selectedCell, selectedCellPath] = cellEntry;

  const matrix = getTableBodyAsMatrix(editor, Path.parent(Path.parent(selectedCellPath)));

  if (matrix && isTableCell(selectedCell)) {
    // If selected cell has same height as entire body. Do nothing.
    if (selectedCell.data.rowspan === matrix.length) {
      return;
    }
    const selectedPath = findCellCoordinate(matrix, selectedCell);
    if (selectedPath) {
      const selectedRowIndex = selectedPath[0];

      Editor.withoutNormalizing(editor, () => {
        // Loop all affected rows
        for (let rowIndex = 0; rowIndex < selectedCell.data.rowspan; rowIndex++) {
          const currentRowPath = [
            ...Path.parent(Path.parent(selectedCellPath)),
            selectedRowIndex + rowIndex,
          ];

          // Loop all affected cells in row to check if any cells spans outside of the area to be removed.
          // We just want to evaluate each cell once, therefore point A and B.

          for (const [columnIndex, cell] of matrix[selectedRowIndex].entries()) {
            // A. If cell in previous column is the same, skip
            if (columnIndex > 0 && cell === matrix[selectedRowIndex + rowIndex][columnIndex - 1]) {
              continue;
            }
            // B. If cell in next row is the same, skip
            if (
              rowIndex < selectedCell.data.rowspan - 1 &&
              cell === matrix[selectedRowIndex + rowIndex + 1][columnIndex]
            ) {
              continue;
            }
            // C. If current cell exists above rows to be deleted => Reduce its rowspan
            if (
              selectedRowIndex > 0 &&
              matrix[selectedRowIndex - 1][columnIndex] === cell &&
              cell.data.rowspan
            ) {
              // Find out how much of the cell height is within the rows that will be removed.
              const reductionAmount = matrix
                .slice(selectedRowIndex, selectedRowIndex + cell.data.rowspan)
                .map(e => e[columnIndex])
                .filter(c => c === cell).length;

              Transforms.setNodes(
                editor,
                {
                  ...cell,
                  data: {
                    ...cell.data,
                    rowspan: cell.data.rowspan - reductionAmount,
                  },
                },
                { at: ReactEditor.findPath(editor, cell) },
              );
              // D. If current cell exists beneith rows to be deleted => Reduce rowspan and move cell below rows to be deleted.
            } else if (
              selectedRowIndex < matrix.length - 1 &&
              matrix[selectedRowIndex + 1][columnIndex] === cell &&
              cell.data.rowspan
            ) {
              // i. Find out how much of the cell height is within the rows that will be removed.
              const reductionAmount = matrix
                .slice(selectedRowIndex, selectedRowIndex + selectedCell.data.rowspan)
                .map(e => e[columnIndex])
                .filter(c => c === cell).length;

              // ii. Find the new target path below the deleted rows.
              const targetPath =
                columnIndex === 0
                  ? [...Path.next(Path.parent(ReactEditor.findPath(editor, cell))), 0]
                  : Path.next(
                      ReactEditor.findPath(editor, matrix[selectedRowIndex + 1][columnIndex - 1]),
                    );

              // iii. Reduce rowspan.
              Transforms.setNodes(
                editor,
                {
                  ...cell,
                  data: {
                    ...cell.data,
                    rowspan: cell.data.rowspan - reductionAmount,
                  },
                },
                { at: ReactEditor.findPath(editor, cell) },
              );

              // iv. Move below deleted rows.
              Transforms.moveNodes(editor, {
                at: ReactEditor.findPath(editor, cell),
                to: targetPath,
              });
            }
          }

          // E.  After cells with rowspan are handled. Just remove the entire row.
          Transforms.removeNodes(editor, {
            at: currentRowPath,
          });
        }
      });
    }
  }
};

export const insertTableHead = (editor: Editor) => {
  const tableBodyEntry = getCurrentBlock(editor, TYPE_TABLE_BODY);
  const tableRowEntry = getCurrentBlock(editor, TYPE_TABLE_ROW);

  if (!tableBodyEntry || !tableRowEntry) {
    return;
  }
  const [bodyElement, bodyPath] = tableBodyEntry;
  const [rowElement] = tableRowEntry;

  if (
    bodyPath &&
    Element.isElement(bodyElement) &&
    bodyElement.type === TYPE_TABLE_BODY &&
    Element.isElement(rowElement) &&
    rowElement.type === TYPE_TABLE_ROW
  ) {
    return Transforms.insertNodes(
      editor,
      {
        ...defaultTableHeadBlock(0),
        children: [
          {
            ...defaultTableRowBlock(0),
            children: rowElement.children.map(cell => {
              if (Element.isElement(cell) && cell.type === TYPE_TABLE_CELL) {
                return {
                  ...defaultTableCellBlock(),
                  data: {
                    ...cell.data,
                    rowspan: 1,
                  },
                };
              }
              return {
                ...defaultTableCellBlock(),
                data: {
                  rowspan: 1,
                  colspan: 1,
                  isHeader: true,
                },
              };
            }),
          },
        ],
      },
      { at: bodyPath },
    );
  }
};

export const insertRow = (editor: Editor, tableElement: TableElement, path: Path) => {
  const [tableBodyEntry] = Editor.nodes(editor, {
    at: path,
    match: node => isTableHead(node) || isTableRow(node),
  });

  if (!tableBodyEntry) {
    return;
  }

  // If tableHead contains two rows. Insert the row in tableBody instead
  const [tableHead, tableHeadPath] = tableBodyEntry;
  if (isTableHead(tableHead)) {
    if (tableHead.children.length === 2) {
      const tableBodyPath = Path.next(tableHeadPath);

      if (Editor.hasPath(editor, tableBodyPath)) {
        const [tableBody] = Editor.node(editor, tableBodyPath);

        if (isTableBody(tableBody)) {
          const firstRow = tableBody.children[0];

          if (isTableRow(firstRow)) {
            return Transforms.insertNodes(
              editor,
              {
                ...defaultTableRowBlock(0),
                children: firstRow.children.map(cell => {
                  if (Element.isElement(cell) && cell.type === TYPE_TABLE_CELL) {
                    return {
                      ...defaultTableCellBlock(),
                      data: {
                        ...cell.data,
                        rowspan: 1,
                      },
                    };
                  }
                  return {
                    ...defaultTableCellBlock(),
                    data: {
                      rowspan: 1,
                      colspan: 1,
                      isHeader: false,
                    },
                  };
                }),
              },
              { at: [...tableBodyPath, 0] },
            );
          }
        }
        // If tableBody does not exist. Insert it with rows matching the end of tableHead
      } else {
        const headerMatrix = getTableBodyAsMatrix(editor, tableHeadPath);
        if (headerMatrix) {
          const lastHeadRow = [...new Set(headerMatrix[headerMatrix.length - 1])];
          return Transforms.insertNodes(
            editor,
            {
              ...defaultTableBodyBlock(0, 0),
              children: [
                {
                  ...defaultTableRowBlock(0),
                  children: lastHeadRow.map((cell, index) => ({
                    ...defaultTableCellBlock(),
                    data: {
                      ...cell.data,
                      isHeader: index === 0 && tableElement.rowHeaders,
                      rowspan: 1,
                    },
                  })),
                },
              ],
            },
            { at: Path.next(tableHeadPath) },
          );
        }
      }
      return;
    }
  }

  const [cellEntry] = Editor.nodes(editor, {
    at: path,
    match: node => isTableCell(node),
  });
  const [cell, cellPath] = cellEntry;

  const matrix = getTableAsMatrix(editor, ReactEditor.findPath(editor, tableElement));

  if (matrix && isTableCell(cell)) {
    const selectedCoordinate = findCellCoordinate(matrix, cell);
    if (selectedCoordinate) {
      const selectedRowIndex =
        selectedCoordinate[0] +
        matrix[selectedCoordinate[0]][selectedCoordinate[1]].data.rowspan -
        1;

      Editor.withoutNormalizing(editor, () => {
        let rowsInserted = 0;
        const currentRowPath = Path.parent(cellPath);
        const newRowPath = [
          ...Path.parent(currentRowPath),
          currentRowPath[currentRowPath.length - 1] + cell.data.rowspan,
        ];
        // Evaluate all cells
        for (const [columnIndex, cell] of matrix[selectedRowIndex].entries()) {
          // A. If cell in previous column is the same, skip
          if (columnIndex > 0 && cell === matrix[selectedRowIndex][columnIndex - 1]) {
            continue;
          }
          // B. If next cell is identical, extend rowspan by 1.
          if (
            columnIndex + 1 < matrix[selectedRowIndex].length &&
            cell.data.rowspan &&
            matrix[selectedRowIndex + 1] &&
            matrix[selectedRowIndex + 1][columnIndex] === cell
          ) {
            Transforms.setNodes(
              editor,
              {
                ...cell,
                data: {
                  ...cell.data,
                  rowspan: cell.data.rowspan + 1,
                },
              },
              { at: ReactEditor.findPath(editor, cell) },
            );
            // Insert cell of same type and width
          } else {
            // C. If not row is inserted yet. Insert a new row.
            if (!rowsInserted) {
              Transforms.insertNodes(editor, slatejsx('element', { type: TYPE_TABLE_ROW }), {
                at: newRowPath,
              });
            }

            // D. Insert new cell with matching colspan.
            Transforms.insertNodes(
              editor,
              {
                ...defaultTableCellBlock(),
                data: {
                  ...cell.data,
                  rowspan: 1,
                },
              },
              {
                at: [...newRowPath, rowsInserted],
              },
            );
            rowsInserted++;
          }
        }
      });
    }
  }
};

export const insertColumn = (editor: Editor, tableElement: TableElement, path: Path) => {
  const [tableBodyEntry] = Editor.nodes(editor, {
    at: path,
    match: node => isTableHead(node) || isTableRow(node),
  });

  if (!tableBodyEntry) {
    return;
  }

  const [cellEntry] = Editor.nodes(editor, {
    at: path,
    match: node => isTableCell(node),
  });
  const [cell] = cellEntry;

  const matrix = getTableAsMatrix(editor, ReactEditor.findPath(editor, tableElement));

  if (matrix && isTableCell(cell)) {
    const selectedPath = findCellCoordinate(matrix, cell);
    if (selectedPath) {
      // Select the right edge of the cell
      const selectedColumnIndex =
        selectedPath[1] + matrix[selectedPath[0]][selectedPath[1]].data.colspan - 1;

      Editor.withoutNormalizing(editor, () => {
        // Evaluate selected column in all rows. Only evaluate each cell once, therefore point A.
        for (const [rowIndex, row] of matrix.entries()) {
          const cell = row[selectedColumnIndex];
          // A. If previous row contains the same cell, skip.
          if (rowIndex > 0 && cell === matrix[rowIndex - 1][selectedColumnIndex]) {
            continue;
          }
          // B. If next row contains an identical cell, extend columnspan by 1.
          if (
            selectedColumnIndex + 1 < row.length &&
            cell.data.colspan &&
            row[selectedColumnIndex + 1] === cell
          ) {
            Transforms.setNodes(
              editor,
              {
                ...cell,
                data: {
                  ...cell.data,
                  colspan: cell.data.colspan + 1,
                },
              },
              { at: ReactEditor.findPath(editor, cell) },
            );
            // C. Otherwise, insert column of same type and height.
          } else {
            Transforms.insertNodes(
              editor,
              {
                ...defaultTableCellBlock(),
                data: {
                  ...cell.data,
                  colspan: 1,
                },
              },
              { at: Path.next(ReactEditor.findPath(editor, cell)) },
            );
          }
        }
      });
    }
  }
};

export const removeColumn = (editor: Editor, tableElement: TableElement, path: Path) => {
  const [tableBodyEntry] = Editor.nodes(editor, {
    at: path,
    match: node => isTableHead(node) || isTableRow(node),
  });

  if (!tableBodyEntry) {
    return;
  }

  const [cellEntry] = Editor.nodes(editor, {
    at: path,
    match: node => isTableCell(node),
  });
  const [cell] = cellEntry;

  const matrix = getTableAsMatrix(editor, ReactEditor.findPath(editor, tableElement));

  const firstBody = tableElement.children[0];

  if (isTableBody(firstBody) || isTableHead(firstBody)) {
    if (getTableBodyWidth(firstBody) === 1) {
      return;
    }
  }

  if (matrix && isTableCell(cell)) {
    const selectedPath = findCellCoordinate(matrix, cell);
    if (selectedPath) {
      const [, selectedColumnIndex] = selectedPath;

      Editor.withoutNormalizing(editor, () => {
        // Evaluate selected column in all rows. Only evaluate each cell once, therefore point A.
        for (const [rowIndex, row] of matrix.entries()) {
          const cell = row[selectedColumnIndex];
          // A. If next row contains the same cell, skip
          if (rowIndex < matrix.length - 1 && cell === matrix[rowIndex + 1][selectedColumnIndex]) {
            continue;
          }
          // B. If cell has spans over multiple columns, reduce span by 1.
          if (cell.data.colspan && cell.data.colspan > 1) {
            Transforms.setNodes(
              editor,
              {
                ...cell,
                data: {
                  ...cell.data,
                  colspan: cell.data.colspan - 1,
                },
              },
              { at: ReactEditor.findPath(editor, cell) },
            );
            // C. Otherwise, remove cell
          } else {
            Transforms.removeNodes(editor, {
              at: ReactEditor.findPath(editor, cell),
            });
          }
        }
      });
    }
  }
};

export const removeTable = (editor: Editor, element: TableElement) => {
  Transforms.removeNodes(editor, {
    at: [],
    match: node => node === element,
  });
};
