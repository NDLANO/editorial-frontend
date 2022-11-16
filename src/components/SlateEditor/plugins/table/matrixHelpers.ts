import { uniq } from 'lodash';
import { TableCellElement, TableMatrix } from './interfaces';

export const getPrevCell = (matrix: TableMatrix, row: number, column: number) => {
  return matrix[row][column - 1];
};

// Find the matrix coordinates for a cell. Returns the coordinates for top left corner of cell.
export const findCellCoordinate = (
  matrix: TableMatrix,
  targetCell: TableCellElement,
): [number, number] | undefined => {
  for (const [rowIndex, row] of matrix.entries()) {
    for (const [cellIndex, cell] of row.entries()) {
      if (cell === targetCell) {
        return [rowIndex, cellIndex];
      }
    }
  }
};

export const getMatrixColumn = (matrix: TableMatrix, index: number) => {
  const column = matrix.map(row => row[index]);
  return uniq(column);
};
