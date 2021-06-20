import { Element } from 'new-slate';
import { LIST_TYPE } from '../index';

export const isList = (el: Element): boolean => {
    return el.type === LIST_TYPE;
}