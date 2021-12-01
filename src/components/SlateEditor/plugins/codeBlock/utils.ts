import { jsx as slatejsx } from 'slate-hyperscript';
import { TYPE_CODEBLOCK } from '.';

export const defaultCodeblockBlock = () =>
  slatejsx('element', { type: TYPE_CODEBLOCK, data: {}, isFirstEdit: true }, [{ text: '' }]);
