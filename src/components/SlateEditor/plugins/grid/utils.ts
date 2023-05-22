import { jsx as slatejsx } from 'slate-hyperscript';
import { defaultParagraphBlock } from '../paragraph/utils';
import { TYPE_GRID, TYPE_GRID_CELL } from './types';

const defaultGridCellBlock = () => {
  return slatejsx(
    'element',
    {
      type: TYPE_GRID_CELL,
    },
    [defaultParagraphBlock()],
  );
};

export const defaultGridBlock = () => {
  return slatejsx(
    'element',
    {
      type: TYPE_GRID,
      data: { columns: '2' },
      isFirstEdit: true,
    },
    [
      defaultGridCellBlock(),
      defaultGridCellBlock(),
      defaultGridCellBlock(),
      defaultGridCellBlock(),
    ],
  );
};
