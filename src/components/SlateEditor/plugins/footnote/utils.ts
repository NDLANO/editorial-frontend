import { Editor, Transforms, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import hasNodeOfType from '../../utils/hasNodeOfType';

export const insertFootnote = (editor: Editor) => {
  if (hasNodeOfType(editor, 'footnote')) {
    Transforms.removeNodes(editor, {
      match: node => Element.isElement(node) && node.type === 'footnote',
      voids: true,
    });
    return;
  }
  Transforms.collapse(editor, { edge: 'end' });
  editor.insertNode(slatejsx('element', { type: 'footnote', data: {} }, [{ text: '' }]));
};
