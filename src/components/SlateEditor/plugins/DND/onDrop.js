import { getEventRange, findNode } from 'slate-react';
import { Text } from 'slate';

const getTopNode = (node, editor) => {
  const parent = editor.value.document.getParent(node.key);
  if (!parent) return null;
  if (parent.type === 'section') {
    return node;
  }
  return getTopNode(parent, editor);
};

function onDrop(event, editor, next) {
  const target = findNode(event.target, editor);
  const targetRange = getEventRange(event, editor);
  const topLevelTarget = getTopNode(target, editor);

  const nodeKey = event.dataTransfer.getData('text/nodeKey');
  const sourceNode = editor.value.document.getNode(nodeKey);
  const topLevelSource = getTopNode(sourceNode, editor);

  if (!topLevelSource || !topLevelTarget) {
    return next();
  }

  const { key: topLevelSourceKey, type: topLevelSourceType } = topLevelSource;

  if (
    Text.isText(sourceNode) &&
    topLevelSourceType !== 'table' &&
    !topLevelSourceType.includes('list')
  ) {
    editor
      .insertTextAtRange(targetRange, sourceNode.text)
      .removeNodeByKey(sourceNode.key)
      .moveToEndOfText()
      .focus();
    return;
  }

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
