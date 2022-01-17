import { Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { ElementType } from '../interfaces';

export const firstTextBlockElement: Element['type'][] = ['paragraph', 'heading', 'quote'];

export const textBlockElements: Element['type'][] = [
  'paragraph',
  'heading',
  'list',
  'quote',
  'table',
  'embed',
  'file',
  'code-block',
];

export const lastTextBlockElement: Element['type'][] = ['paragraph'];

export const afterOrBeforeTextBlockElement: Element['type'][] = ['paragraph', 'heading'];

export const createNode = (type: ElementType, attributes?: Partial<Element>) =>
  slatejsx('element', { ...attributes, type });
