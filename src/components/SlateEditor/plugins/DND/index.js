import { findNode, getEventRange } from 'slate-react';
import { Text } from 'slate';
import onDrop from './onDrop';
import { getTopNode } from './utils';

function onDragOver(event, editor, next) {
  event.stopPropagation();
  event.preventDefault();
}

function onDragStart(event, editor, next) {
  const dragSource = findNode(event.target, editor);
  const { type } = getTopNode(dragSource, editor);
  if (Text.isText(dragSource) && type !== 'table' && !type.includes('list')) {
    // just copy the text natively
    return next();
  }
  event.dataTransfer.setData('text/nodeKey', dragSource.key);
}

export default { onDragStart, onDragOver, onDrop, schema: {} };
