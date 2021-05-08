import { Editor, Range, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';

export const insertMathml = (editor: Editor) => {
  if (!Range.isRange(editor.selection)) return;
  if (Range.isCollapsed(editor.selection)) {
    Transforms.insertNodes(editor, jsx('element', { type: 'mathml', data: {} }, [{ text: '' }]));
  } else {
    Transforms.wrapNodes(editor, jsx('element', { type: 'mathml', data: {} }, [{ text: '' }]));
  }
};
