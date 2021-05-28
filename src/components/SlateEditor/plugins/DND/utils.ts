import { Editor, Element } from 'slate';

export const getTopNode = (node: Element, editor: Editor): Element | null => {
  if (node.type === 'section') {
    return node;
  }
  const parent = editor.value.document.getParent(node.key);
  if (!parent) {
    return null;
  }
  if (parent.type === 'section') {
    return node;
  }
  return getTopNode(parent, editor);
};

export const shouldCopyTableOrList = (type: string, editor: Editor) => {
  if (type === 'table' || type.includes('list')) {
    const nativeSelection = window.getSelection();
    const range = editor.findRange(nativeSelection);
    const nodesInRange = editor.value.document.getLeafBlocksAtRange(range);
    return nodesInRange.size > 1;
  }
  return false;
};
