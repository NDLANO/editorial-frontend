/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { jsx as slatejsx } from 'slate-hyperscript';
import { defaultParagraphBlock } from '../paragraph/utils';
import { TableElement, TableCaptionElement, TableCellElement } from './interfaces';
import {
  TYPE_TABLE,
  TYPE_TABLE_CAPTION,
  TYPE_TABLE_CELL,
  TYPE_TABLE_ROW,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_BODY,
  TYPE_TABLE_CELL_HEADER,
} from './types';

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

export const defaultTableCellHeaderBlock = () => {
  return slatejsx(
    'element',
    {
      type: TYPE_TABLE_CELL_HEADER,
      data: {
        isHeader: true,
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

export const defaultTableRowBlock = (width: number, header = false) => {
  return slatejsx(
    'element',
    {
      type: TYPE_TABLE_ROW,
    },
    [...Array(width)].map(() => (header ? defaultTableCellHeaderBlock() : defaultTableCellBlock())),
  );
};

export const defaultTableHeadBlock = (width: number) => {
  return slatejsx(
    'element',
    {
      type: TYPE_TABLE_HEAD,
    },
    [defaultTableRowBlock(width, true)],
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
