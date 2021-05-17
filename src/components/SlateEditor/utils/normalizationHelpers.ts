import { Element } from 'slate';

export const firstTextBlockElement: Element['type'][] = ['paragraph', 'heading'];

export const textBlockElements: Element['type'][] = [
  'paragraph',
  'heading',
  //'bulleted-list',
  //'letter-list',
  //'numbered-list',
  'quote',
  //'table',
  //'embed',
  //'file',
  //'code-block',
];

export const lastTextBlockElement: Element['type'][] = ['paragraph'];

export const afterTextBlockElement: Element['type'][] = ['paragraph', 'heading'];
