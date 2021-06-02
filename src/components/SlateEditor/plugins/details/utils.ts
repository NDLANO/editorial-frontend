import { jsx } from 'slate-hyperscript';
import { TYPE_DETAILS } from '.';

export const defaultDetailsBlock = jsx('element', { type: TYPE_DETAILS }, [{ text: '' }]);
