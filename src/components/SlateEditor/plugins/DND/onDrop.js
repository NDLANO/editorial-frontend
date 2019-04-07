import { findNode } from 'slate-react';
import { getTopNode } from './utils';

function onDrop(event, editor, next) {
  const target = findNode(event.target, editor);
  const topLevelTarget = getTopNode(target, editor);

  const nodeKey = event.dataTransfer.getData('text/nodeKey');
  const sourceNode = editor.value.document.getNode(nodeKey);
  if (!sourceNode) {
    return next();
  }
  const topLevelSource = getTopNode(sourceNode, editor);

  if (!topLevelSource || !topLevelTarget) {
    return next();
  }

  const { key: topLevelSourceKey } = topLevelSource;

  if (topLevelTarget.type === 'paragraph' && topLevelTarget.text === '') {
    editor.withoutNormalizing(() => {
      editor
        .moveNodeByKey(topLevelSourceKey, topLevelTarget.key, 0)
        .unwrapNodeByKey(topLevelSourceKey)
        .moveToEndOfNode(topLevelSource);
    });
  } else {
    editor.withoutNormalizing(() => {
      editor
        .moveNodeByKey(topLevelSourceKey, topLevelTarget.key, 0)
        .unwrapNodeByKey(topLevelSourceKey)
        .moveToEndOfNode(topLevelSource);
    });
  }
}

export default onDrop;
