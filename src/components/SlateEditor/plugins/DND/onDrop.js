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
  if (
    !topLevelSource ||
    !topLevelTarget ||
    topLevelTarget.key === topLevelSource.key
  ) {
    return next();
  }

  const { key: topLevelSourceKey } = topLevelSource;

  if (topLevelTarget.type === 'paragraph' && topLevelTarget.text === '') {
    editor.withoutNormalizing(() => {
      editor
        .moveNodeByKey(topLevelSourceKey, topLevelTarget.key, 0)
        .unwrapNodeByKey(topLevelSourceKey);
    });
  } else {
    const { height, top } = event.target.getBoundingClientRect();
    const goUp = top + height / 2 > event.clientY;

    editor.withoutNormalizing(() => {
      editor
        .moveNodeByKey(
          topLevelSourceKey,
          topLevelTarget.key,
          goUp ? 0 : topLevelTarget.nodes.size,
        )
        .unwrapNodeByKey(topLevelSourceKey);
    });
  }
}

export default onDrop;
