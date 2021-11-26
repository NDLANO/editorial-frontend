import { Editor, Element, Range, Transforms } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import hasNodeOfType from '../../utils/hasNodeOfType';

export const insertMathml = (editor: Editor) => {
  const { selection } = editor;
  if (!Range.isRange(selection)) return;

  if (hasNodeOfType(editor, 'mathml')) {
    Transforms.unwrapNodes(editor, {
      match: node => Element.isElement(node) && node.type === 'mathml',
      voids: true,
    });
    return;
  }

  if (Range.isCollapsed(selection)) {
    Transforms.insertNodes(
      editor,
      slatejsx('element', { type: 'mathml', data: {} }, [{ text: '' }]),
      {
        at: Editor.unhangRange(editor, selection),
      },
    );
  } else {
    Transforms.wrapNodes(
      editor,
      slatejsx('element', { type: 'mathml', data: {} }, [{ text: '' }]),
      {
        at: Editor.unhangRange(editor, selection),
        split: true,
      },
    );
  }
};
