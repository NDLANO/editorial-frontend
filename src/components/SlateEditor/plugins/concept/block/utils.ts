import { jsx as slatejsx } from 'slate-hyperscript';
import { TYPE_CONCEPT_BLOCK } from './types';

export const defaultConceptBlock = () =>
  slatejsx('element', { type: TYPE_CONCEPT_BLOCK, data: {} }, [{ text: '' }]);
