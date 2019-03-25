/**
 * User pressed Delete in an editor:
 * Unwrap the blockquote if at the start of the inner block.
 */
function onBackspace(event, editor, next) {
  const { value } = editor;
  const { start, isCollapsed } = value.selection;
  const node = value.document.getNode(value.selection.anchor.path);
  const paragraphNode = value.document.getParent(node.key);
  const blockNode = value.document.getParent(paragraphNode.key);

  if (blockNode.type !== 'details' || !isCollapsed) {
    return next();
  }

  if (blockNode.nodes.size > 2 || start.offset !== 0) {
    return next();
  }

  // We delete the detail block
  event.preventDefault();

  return editor.removeNodeByKey(blockNode.key);
}

export default onBackspace;
