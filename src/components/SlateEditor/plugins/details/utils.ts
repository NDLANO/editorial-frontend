import { jsx as slatejsx } from 'slate-hyperscript';
import { defaultParagraphBlock } from '../paragraph/utils';
import { TYPE_DETAILS, TYPE_SUMMARY } from './types';

export const defaultSummaryBlock = () => slatejsx('element', { type: TYPE_SUMMARY }, { text: '' });

export const defaultDetailsBlock = () =>
  slatejsx('element', { type: TYPE_DETAILS }, defaultSummaryBlock(), defaultParagraphBlock());
