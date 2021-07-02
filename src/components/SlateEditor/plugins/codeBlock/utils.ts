import { jsx } from 'slate-hyperscript';
import { TYPE_CODEBLOCK } from '.';

export const defaultCodeblockBlock = () =>
  jsx('element', { type: TYPE_CODEBLOCK, data: {} }, [{ text: '' }]);
