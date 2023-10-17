import { Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { ElementType } from '../interfaces';
import { TYPE_ASIDE } from '../plugins/aside/types';
import { TYPE_QUOTE } from '../plugins/blockquote/types';
import { TYPE_BODYBOX } from '../plugins/bodybox/types';
import { TYPE_CODEBLOCK } from '../plugins/codeBlock/types';
import { TYPE_DEFINITION_LIST } from '../plugins/definitionList/types';
import { TYPE_DETAILS } from '../plugins/details/types';
import {
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_ERROR,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_H5P,
} from '../plugins/embed/types';
import { TYPE_FILE } from '../plugins/file/types';
import { TYPE_HEADING } from '../plugins/heading/types';
import { TYPE_LIST } from '../plugins/list/types';
import { TYPE_PARAGRAPH } from '../plugins/paragraph/types';
import { TYPE_TABLE } from '../plugins/table/types';
import { TYPE_AUDIO } from '../plugins/audio/types';
import { TYPE_GRID } from '../plugins/grid/types';

export const firstTextBlockElement: Element['type'][] = [TYPE_PARAGRAPH, TYPE_HEADING, TYPE_QUOTE];

export const textBlockElements: Element['type'][] = [
  TYPE_PARAGRAPH,
  TYPE_HEADING,
  TYPE_LIST,
  TYPE_QUOTE,
  TYPE_TABLE,
  TYPE_AUDIO,
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_ERROR,
  TYPE_EMBED_H5P,
  TYPE_FILE,
  TYPE_CODEBLOCK,
  TYPE_ASIDE,
  TYPE_BODYBOX,
  TYPE_DETAILS,
  TYPE_DEFINITION_LIST,
  TYPE_GRID,
];

export const lastTextBlockElement: Element['type'][] = [TYPE_PARAGRAPH];

export const afterOrBeforeTextBlockElement: Element['type'][] = [TYPE_PARAGRAPH, TYPE_HEADING];

export const createNode = (type: ElementType, attributes?: Partial<Element>) =>
  slatejsx('element', { ...attributes, type });
