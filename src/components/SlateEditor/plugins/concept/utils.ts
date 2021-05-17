import { Editor, Transforms, Element, Range } from 'slate';
import { jsx } from 'slate-hyperscript';
import hasNodeOfType from '../../utils/hasNodeOfType';

export const insertConcept = (editor: Editor) => {
  if (hasNodeOfType(editor, 'concept')) {
    Transforms.unwrapNodes(editor, {
      match: node => Element.isElement(node) && node.type === 'concept',
      voids: true,
    });
    return;
  }
  if (Range.isRange(editor.selection) && !Range.isCollapsed(editor.selection)) {
    Transforms.wrapNodes(editor, jsx('element', { type: 'concept', data: {} }, [{ text: '' }]), {
      at: Editor.unhangRange(editor, editor.selection),
    });
  }
};
