import { Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { ElementType } from '../interfaces';
import { TYPE_ASIDE } from '../plugins/aside/types';
import { TYPE_QUOTE } from '../plugins/blockquote';
import { TYPE_BODYBOX } from '../plugins/bodybox/utils';
import { TYPE_CODEBLOCK } from '../plugins/codeBlock/types';
import { TYPE_DETAILS } from '../plugins/details/types';
import { TYPE_EMBED } from '../plugins/embed';
import { TYPE_FILE } from '../plugins/file';
import { TYPE_HEADING } from '../plugins/heading';
import { TYPE_LIST } from '../plugins/list/types';
import { TYPE_PARAGRAPH } from '../plugins/paragraph/utils';
import { TYPE_TABLE } from '../plugins/table/utils';

export const firstTextBlockElement: Element['type'][] = [TYPE_PARAGRAPH, TYPE_HEADING, TYPE_QUOTE];

export const textBlockElements: Element['type'][] = [
  TYPE_PARAGRAPH,
  TYPE_HEADING,
  TYPE_LIST,
  TYPE_QUOTE,
  TYPE_TABLE,
  TYPE_EMBED,
  TYPE_FILE,
  TYPE_CODEBLOCK,
  TYPE_ASIDE,
  TYPE_BODYBOX,
  TYPE_DETAILS,
];

export const lastTextBlockElement: Element['type'][] = [TYPE_PARAGRAPH];

export const afterOrBeforeTextBlockElement: Element['type'][] = [TYPE_PARAGRAPH, TYPE_HEADING];

export const createNode = (type: ElementType, attributes?: Partial<Element>) =>
  slatejsx('element', { ...attributes, type });
