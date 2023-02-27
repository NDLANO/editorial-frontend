import { Editor, Transforms } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_LIST, TYPE_DEFINTION_TERM } from './types';

export const definitionTerm = slatejsx('element', { type: TYPE_DEFINTION_TERM }, [{ text: '' }]);
export const definitionDescription = slatejsx('element', { type: TYPE_DEFINTION_DESCRIPTION }, [
  { text: '' },
]);
export const definitionList = slatejsx('element', { type: TYPE_DEFINTION_LIST });

export const toggleDefinitionList = (editor: Editor) => {
  Transforms.wrapNodes(editor, definitionList);
};
