import { jsx } from 'slate-hyperscript';
import { TYPE_DETAILS, TYPE_SUMMARY } from '.';
import { defaultParagraphBlock } from '../paragraph/utils';

export const defaultSummaryBlock = jsx('element', { type: TYPE_SUMMARY }, { text: '' });

export const defaultDetailsBlock = jsx(
  'element',
  { type: TYPE_DETAILS },
  defaultSummaryBlock,
  defaultParagraphBlock,
);
