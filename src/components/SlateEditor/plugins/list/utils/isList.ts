import { Element } from 'slate';
import { TYPE_LIST } from '../types';

export const isList = (el: Element): boolean => {
  return el.type === TYPE_LIST;
};
