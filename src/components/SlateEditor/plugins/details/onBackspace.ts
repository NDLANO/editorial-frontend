/**
 * User pressed Delete in an editor:
 * Unwrap the blockquote if at the start of the inner block.
 */
import { Point } from 'slate';
import { findNodesByType } from '../../../../util/slateHelpers';

/*
   editor.value.document.getOffset(node.key) is the offset of the current node where the cursor is. Blocknode is either the details or solution block. 
   We also have to add the summaray text length to see if we should jump out of the block or delete text.
  */
function handleBackspaceAndCheckOffsetinDetailsblock(
  editor,
  next,
  start,
  node,
  blockNode,
  summaryTextLength,
) {
  if (
    editor.value.document.getOffset(node.key) ===
      editor.value.document.getOffset(blockNode.key) + summaryTextLength &&
    start.offset === 0
  ) {
    const firstPosition = Point.create({
      key: editor.value.document.getPreviousBlock(blockNode.key).key,
      offset: 0,
    });

    return editor.select({
      anchor: firstPosition,
      focus: firstPosition,
      isFocused: true,
    });
  }
  return next();
}

function onBackspace(event, editor, next) {
  const { value } = editor;
  const { start, isCollapsed } = value.selection;
  const node = value.document.getNode(value.selection.anchor.path);
  const paragraphNode = value.document.getParent(node.key);
  const blockNode = value.document.getParent(paragraphNode.key);

  if (
    (blockNode.type !== 'details' && blockNode.type !== 'solutionbox') ||
    !isCollapsed
  ) {
    return next();
  }
  const summaryNode = findNodesByType(blockNode, 'summary');
  const summaryTextLength =
    summaryNode && summaryNode[0] ? summaryNode[0].text.length : 0;

  // Detail/solution block should be deleted if the text length (excluding summary) is 0 or there are no other elements in the block.
  if (
    blockNode.nodes.size > 0 &&
    blockNode.text.length - summaryTextLength > 0
  ) {
    return handleBackspaceAndCheckOffsetinDetailsblock(
      editor,
      next,
      start,
      node,
      blockNode,
      summaryTextLength,
    );
  }

  event.preventDefault();
  return editor.removeNodeByKey(blockNode.key);
}

export default onBackspace;
