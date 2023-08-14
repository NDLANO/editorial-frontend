/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from 'slate-hyperscript';
import { defaultParagraphBlock } from '../paragraph/utils';
import { TYPE_GRID, TYPE_GRID_CELL } from './types';

export const defaultGridCellBlock = () => {
  return slatejsx(
    'element',
    {
      type: TYPE_GRID_CELL,
      data: { parallaxCell: 'false' },
    },
    defaultParagraphBlock(),
  );
};

export const defaultGridBlock = () => {
  return slatejsx(
    'element',
    {
      type: TYPE_GRID,
      data: { columns: 2, border: 'none', background: 'transparent' },
    },
    [[defaultGridCellBlock(), defaultGridCellBlock()]],
  );
};
