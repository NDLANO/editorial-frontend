/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { jsx as slatejsx } from 'slate-hyperscript';
import { TYPE_LIST, TYPE_LIST_ITEM } from '../types';

export const defaultListBlock = (listType: string) => {
  return slatejsx('element', { type: TYPE_LIST, listType, data: {} });
};

export const defaultListItemBlock = () => {
  return slatejsx('element', { type: TYPE_LIST_ITEM });
};
