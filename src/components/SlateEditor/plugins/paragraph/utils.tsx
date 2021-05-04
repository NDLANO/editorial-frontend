import { Editor, Node, Element } from 'new-slate';
import { TYPE_PARAGRAPH } from './index';

export const getCurrentParagraph = (editor: Editor) => {
  if (!editor.selection?.anchor) return null;
  const startBlock = Node.parent(editor, editor.selection?.anchor.path);
  if (!Element.isElement(startBlock)) {
    return null;
  }
  return startBlock && startBlock?.type === TYPE_PARAGRAPH ? startBlock : null;
};
