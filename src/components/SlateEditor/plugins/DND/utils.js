import { findRange } from 'slate-react';

export const getTopNode = (node, editor) => {
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

export const shouldCopyTableOrList = (type, editor) => {
  if (type === 'table' || type.includes('list')) {
    const nativeSelection = window.getSelection();
    const range = findRange(nativeSelection, editor);
    const nodesInRange = editor.value.document.getLeafBlocksAtRange(range);
    return nodesInRange.size > 1;
  }
  return false;
};
