import { Editor, Transforms } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';

export const insertFootnote = (editor: Editor) => {
  Transforms.collapse(editor, { edge: 'end' });
  editor.insertNode(jsx('element', { type: 'footnote', data: {} }, [{ text: '' }]));
};
