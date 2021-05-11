import { Editor, Element, Transforms } from 'new-slate';
import { isBlockActive } from '../../utils';
import { TYPE_QUOTE } from './index';

export const toggleQuote = (editor: Editor) => {
  const isActive = isBlockActive(editor, TYPE_QUOTE);

  if (isActive) {
    Transforms.unwrapNodes(editor, {
      mode: 'lowest',
      match: node => Element.isElement(node) && node.type === TYPE_QUOTE,
    });
  } else {
    Transforms.wrapNodes(
      editor,
      { type: 'quote' },
      {
        mode: 'lowest',
        match: node => Element.isElement(node) && node.type === 'paragraph',
      },
    );
  }
};

export const getCurrentQuote = (editor: Editor) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'quote',
    mode: 'lowest',
  });
  return match;
};
