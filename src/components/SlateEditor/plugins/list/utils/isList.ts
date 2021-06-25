import { Element } from 'slate';
import { TYPE_LIST } from '../index';

export const isList = (el: Element): boolean => {
  return el.type === TYPE_LIST;
};
