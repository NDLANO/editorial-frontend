import { findNode } from 'slate-react';
import onDrop from './onDrop';

function onDragOver(event, editor, next) {
  event.stopPropagation();
  event.preventDefault();
}

function onDragStart(event, editor, next) {
  const dragSource = findNode(event.target, editor);
  event.dataTransfer.setData('text/nodeKey', dragSource.key);
}

export default { onDragStart, onDragOver, onDrop, schema: {} };
