import { jsx as slatejsx } from 'slate-hyperscript';
import { TYPE_LIST, TYPE_LIST_ITEM } from '../types';

export const defaultListBlock = (listType: string) => {
  return slatejsx('element', { type: TYPE_LIST, listType, data: {} });
};

export const defaultListItemBlock = () => {
  return slatejsx('element', { type: TYPE_LIST_ITEM });
};
