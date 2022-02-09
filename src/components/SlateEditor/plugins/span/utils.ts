import { Editor, Element, Range, Transforms } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { SpanElement, TYPE_SPAN } from '.';
import hasNodeOfType from '../../utils/hasNodeOfType';

export const defaultSpanBlock = () =>
  slatejsx('element', { type: TYPE_SPAN, data: {} }, { text: '' }) as SpanElement;

export const toggleSpan = (editor: Editor) => {
  if (hasNodeOfType(editor, TYPE_SPAN)) {
    Transforms.unwrapNodes(editor, {
      match: node => Element.isElement(node) && node.type === TYPE_SPAN,
    });
    return;
  }

  if (Range.isRange(editor.selection) && !Range.isCollapsed(editor.selection)) {
    Transforms.wrapNodes(editor, defaultSpanBlock(), {
      at: Editor.unhangRange(editor, editor.selection),
      split: true,
    });
  }
};
