import { Editor, Element, Path, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { ReactEditor } from 'slate-react';
import { TableElement, TableRowElement, TableHeadElement, TableBodyElement } from '.';
import { defaultParagraphBlock } from '../paragraph/utils';
import { findCellInMatrix, getTableAsMatrix, getTableBodyAsMatrix } from './matrix';

export const TYPE_TABLE = 'table';
export const TYPE_TABLE_HEAD = 'table-head';
export const TYPE_TABLE_BODY = 'table-body';
export const TYPE_TABLE_ROW = 'table-row';
export const TYPE_TABLE_CELL = 'table-cell';

export const countCells = (row: TableRowElement, stop?: number) => {
  return row.children
    .map(child => {
      if (!Element.isElement(child) || child.type !== TYPE_TABLE_CELL) {
        return 0;
      }
      return child.data.colspan;
    })
    .slice(0, stop)
    .reduce((a, b) => a + b);
};

export const defaultTableBlock = (height: number, width: number) => {
  return jsx('element', { type: TYPE_TABLE }, [
    defaultTableHeadBlock(width),
    defaultTableBodyBlock(height - 1, width),
  ]);
};

export const defaultTableCellBlock = () => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_CELL,
      data: {
        isHeader: false,
      },
    },
    defaultParagraphBlock(),
  );
};

export const defaultTableRowBlock = (width: number) => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_ROW,
    },
    [...Array(width)].map(() => defaultTableCellBlock()),
  );
};

export const defaultTableHeadBlock = (width: number) => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_HEAD,
    },
    defaultTableRowBlock(width),
  );
};

export const defaultTableBodyBlock = (height: number, width: number) => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_BODY,
    },
    [...Array(height)].map(() => defaultTableRowBlock(width)),
  );
};

export const getTableWidth = (element: TableHeadElement | TableBodyElement) => {
  const firstRow = element.children[0];
  if (Element.isElement(firstRow) && firstRow.type === TYPE_TABLE_ROW) {
    return countCells(firstRow);
  }
  return 0;
};

export const getTableHeight = (element: TableHeadElement | TableBodyElement) => {
  return element.children.length;
};

export const createIdenticalRow = (element: TableRowElement) => {
  return jsx(
    'element',
    { type: TYPE_TABLE_ROW },
    element.children.map(child => {
      if (Element.isElement(child) && child.type === TYPE_TABLE_CELL) {
        return {
          ...defaultTableCellBlock(),
          data: {
            ...child.data,
            rowspan: undefined,
          },
        };
      }
      return defaultTableCellBlock();
    }),
  );
};

export const removeRow = (editor: Editor, path: Path) => {
  const [cellEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const [selectedCell, selectedCellPath] = cellEntry;

  const matrix = getTableBodyAsMatrix(editor, Path.parent(Path.parent(selectedCellPath)));

  if (matrix && Element.isElement(selectedCell) && selectedCell.type === TYPE_TABLE_CELL) {
    // If selected cell has same height as entire body. Don't delete anything.
    if ((selectedCell.data.rowspan || 1) === matrix.length) {
      return;
    }
    const selectedPath = findCellInMatrix(matrix, selectedCell);
    if (selectedPath) {
      const selectedRowIndex = selectedPath[0];

      Editor.withoutNormalizing(editor, () => {
        for (let rowIndex = 0; rowIndex < selectedCell.data.rowspan; rowIndex++) {
          const currentRowPath = [
            ...Path.parent(Path.parent(selectedCellPath)),
            selectedRowIndex + rowIndex,
          ];

          for (const [columnIndex, cell] of matrix[selectedRowIndex].entries()) {
            // If cell in previous column is the same, skip
            if (columnIndex > 0 && cell === matrix[selectedRowIndex + rowIndex][columnIndex - 1]) {
              continue;
            }
            // If cell in next row is the same, skip
            if (
              rowIndex < selectedCell.data.rowspan - 1 &&
              cell === matrix[selectedRowIndex + rowIndex + 1][columnIndex]
            ) {
              continue;
            }
            // If current cell exists above rows to be deleted => Reduce rowspan
            if (
              selectedRowIndex > 0 &&
              matrix[selectedRowIndex - 1][columnIndex] === cell &&
              cell.data.rowspan
            ) {
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
              // If current cell exists beneith rows to be deleted => Reduce rowspan and move cell down.
            } else if (
              selectedRowIndex < matrix.length - 1 &&
              matrix[selectedRowIndex + 1][columnIndex] === cell &&
              cell.data.rowspan
            ) {
              const reductionAmount = matrix
                .slice(selectedRowIndex, selectedRowIndex + selectedCell.data.rowspan)
                .map(e => e[columnIndex])
                .filter(c => c === cell).length;

              const targetPath =
                columnIndex === 0
                  ? [...Path.next(Path.parent(ReactEditor.findPath(editor, cell))), 0]
                  : Path.next(
                      ReactEditor.findPath(editor, matrix[selectedRowIndex + 1][columnIndex - 1]),
                    );

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

              Transforms.moveNodes(editor, {
                at: ReactEditor.findPath(editor, cell),
                to: targetPath,
              });
            }
          }

          // Delete current row
          Transforms.removeNodes(editor, {
            at: currentRowPath,
          });
        }
      });
    }
  }
};

export const insertRow = (editor: Editor, tableElement: TableElement, path: Path) => {
  const [cellEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const [cell, cellPath] = cellEntry;

  const matrix = getTableAsMatrix(editor, ReactEditor.findPath(editor, tableElement));

  if (matrix && Element.isElement(cell) && cell.type === TYPE_TABLE_CELL) {
    const selectedPath = findCellInMatrix(matrix, cell);
    if (selectedPath) {
      const selectedRowIndex =
        selectedPath[0] + matrix[selectedPath[0]][selectedPath[1]].data.rowspan - 1;

      Editor.withoutNormalizing(editor, () => {
        let rowsInserted = 0;
        const currentRowPath = Path.parent(cellPath);
        const newRowPath = [
          ...Path.parent(currentRowPath),
          currentRowPath[currentRowPath.length - 1] + cell.data.rowspan,
        ];
        for (const [columnIndex, cell] of matrix[selectedRowIndex].entries()) {
          // If cell in previous column is the same, skip

          if (columnIndex > 0 && cell === matrix[selectedRowIndex][columnIndex - 1]) {
            continue;
          }
          // If next cell is identical, extend rowspan
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
            if (!rowsInserted) {
              Transforms.insertNodes(editor, jsx('element', { type: TYPE_TABLE_ROW }), {
                at: newRowPath,
              });
            }

            Transforms.insertNodes(
              editor,
              {
                type: TYPE_TABLE_CELL,
                data: {
                  ...cell.data,
                  rowspan: 1,
                },
                children: [defaultParagraphBlock()],
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
  const [cellEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const [cell] = cellEntry;

  const matrix = getTableAsMatrix(editor, ReactEditor.findPath(editor, tableElement));

  if (matrix && Element.isElement(cell) && cell.type === TYPE_TABLE_CELL) {
    const selectedPath = findCellInMatrix(matrix, cell);
    if (selectedPath) {
      const selectedColumnIndex =
        selectedPath[1] + matrix[selectedPath[0]][selectedPath[1]].data.colspan - 1;

      Editor.withoutNormalizing(editor, () => {
        for (const [rowIndex, row] of matrix.entries()) {
          const cell = row[selectedColumnIndex];
          // If previous row contains the same cell, skip
          if (rowIndex > 0 && cell === matrix[rowIndex - 1][selectedColumnIndex]) {
            continue;
          }
          // If next cell is identical, extend columnspan
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
            // Insert column of same type and height
          } else {
            Transforms.insertNodes(
              editor,
              {
                type: TYPE_TABLE_CELL,
                data: {
                  ...cell.data,
                  colspan: 1,
                },
                children: [defaultParagraphBlock()],
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
  const [cellEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const [cell] = cellEntry;

  const matrix = getTableAsMatrix(editor, ReactEditor.findPath(editor, tableElement));

  if (matrix && Element.isElement(cell) && cell.type === TYPE_TABLE_CELL) {
    const selectedPath = findCellInMatrix(matrix, cell);
    if (selectedPath) {
      const [, selectedColumnIndex] = selectedPath;

      Editor.withoutNormalizing(editor, () => {
        for (const [rowIndex, row] of matrix.entries()) {
          const cell = row[selectedColumnIndex];
          // If next row contains the same cell, skip
          if (rowIndex < matrix.length - 1 && cell === matrix[rowIndex + 1][selectedColumnIndex]) {
            continue;
          }
          // If cell has spans over multiple columns, reduce span by 1.
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
            // Remove cell
          } else {
            Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, cell) });
          }
        }
      });
    }
  }
};

export const removeTable = (editor: Editor, path: Path) => {
  Transforms.removeNodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE,
  });
};
