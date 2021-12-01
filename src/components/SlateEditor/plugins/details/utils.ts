import { jsx as slatejsx } from 'slate-hyperscript';
import { TYPE_DETAILS, TYPE_SUMMARY } from '.';
import { defaultParagraphBlock } from '../paragraph/utils';

export const defaultSummaryBlock = () => slatejsx('element', { type: TYPE_SUMMARY }, { text: '' });

export const defaultDetailsBlock = () =>
  slatejsx('element', { type: TYPE_DETAILS }, defaultSummaryBlock(), defaultParagraphBlock());
