import { findNode, findRange } from 'slate-react';
import { Text } from 'slate';
import onDrop from './onDrop';
import { getTopNode } from './utils';

function onDragOver(event, editor, next) {
  event.stopPropagation();
  event.preventDefault();
}

const shouldCopyTableOrList = (type, editor) => {
  if (type === 'table' || type.includes('list')) {
    const nativeSelection = window.getSelection();
    const range = findRange(nativeSelection, editor);
    const nodesInRange = editor.value.document.getLeafBlocksAtRange(range);
    if (nodesInRange.size > 1) return true;
  }
  return false;
};

function onDragStart(event, editor, next) {
  const dragSource = findNode(event.target, editor);
  const { type } = getTopNode(dragSource, editor);
  if (Text.isText(dragSource) && !shouldCopyTableOrList(type, editor)) {
    // just copy the text natively
    console.log('native');
    return next();
  }
  event.dataTransfer.setData('text/nodeKey', dragSource.key);
}

export default { onDragStart, onDragOver, onDrop, schema: {} };
