import { Editor, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';

export const insertFootnote = (editor: Editor) => {
  Transforms.collapse(editor, { edge: 'end' });
  editor.insertNode(jsx('element', { type: 'footnote', data: {} }, [{ text: '' }]));
};
