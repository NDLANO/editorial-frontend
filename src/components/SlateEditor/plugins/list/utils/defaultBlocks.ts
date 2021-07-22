import { jsx } from 'slate-hyperscript';
import { TYPE_LIST, TYPE_LIST_ITEM } from '../';

export const defaultListBlock = (listType: string) => {
  return jsx('element', { type: TYPE_LIST, listType, data: {} });
};

export const defaultListItemBlock = () => {
  return jsx('element', { type: TYPE_LIST_ITEM });
};
