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
  const topLevelTarget = getTopNode(target, editor);
  console.log(target);
  const nodeKey = event.dataTransfer.getData('text/nodeKey');
  const sourceNode = editor.value.document.getNode(nodeKey);
  const topLevelSourceNode = getTopNode(sourceNode, editor);
  const targetRange = getEventRange(event, editor);

  if (!topLevelSourceNode || !topLevelSourceNode.key || !topLevelTarget) {
    return next();
  }

  if (Text.isText(sourceNode)) {
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
        .moveNodeByKey(topLevelSourceNode.key, topLevelTarget.key, 0)
        .unwrapNodeByKey(topLevelSourceNode.key)
        .moveToEndOfNode(topLevelSourceNode);
    });
  } else {
    editor.withoutNormalizing(() => {
      editor
        .moveNodeByKey(topLevelSourceNode.key, topLevelTarget.key, 0)
        .unwrapNodeByKey(topLevelSourceNode.key)
        .moveToEndOfNode(topLevelSourceNode);
    });
  }
}

function onDragOver(event, editor, next) {
  event.stopPropagation();
  event.preventDefault();
}

function onDragStart(event, editor, next) {
  const dragSource = findNode(event.target, editor);
  /* const json = btoa(encodeURIComponent(JSON.stringify(dragSource))); */
  console.log(dragSource);
  event.dataTransfer.setData('text/nodeKey', dragSource.key);
}

export default { onDragStart, onDragOver, onDrop, schema: {} };
