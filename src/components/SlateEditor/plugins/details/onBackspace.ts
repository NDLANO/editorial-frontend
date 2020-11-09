/**
 * User pressed Delete in an editor:
 * Unwrap the blockquote if at the start of the inner block.
 */
import { Block, Document, Editor, Inline, Node, Point } from 'slate';
import { findNodesByType } from '../../../../util/slateHelpers';

type ParentNode = Document | Block | Inline | null;

/*
   editor.value.document.getOffset(node.key) is the offset of the current node where the cursor is. Blocknode is the details block. 
   We also have to add the summary text length to see if we should jump out of the block or delete text.
  */
const handleBackspaceAndCheckOffsetInDetailsblock = (
  blockNode: Node,
  editor: Editor,
  next: () => void,
  node: Node,
  start: Point,
  summaryTextLength: number,
) => {
  if (
    editor.value.document.getOffset(node.key) ===
      editor.value.document.getOffset(blockNode.key) + summaryTextLength &&
    start.offset === 0
  ) {
    // Last position in previous node.
    const previousNode = editor.value.document.getPreviousNode(blockNode.key);
    const firstPosition = Point.create({
      key: previousNode?.key,
      offset: previousNode?.text.length,
    });

    return editor.select({
      anchor: firstPosition,
      focus: firstPosition,
      isFocused: true,
    });
  }
  return next();
};

const onBackspace = (
  editor: Editor,
  event: KeyboardEvent,
  next: () => void,
): Editor | void => {
  const { value } = editor;
  const { start, isCollapsed } = value.selection;
  const node = value.document.getNode(value.selection.anchor.path);
  if (node === null) return;

  const paragraphNode = value.document.getParent(node.key);
  if (paragraphNode === null) return;

  const blockNode = value.document.getParent(paragraphNode.key) as ParentNode;
  if (blockNode === null) return;

  if (blockNode.type !== 'details' || !isCollapsed) {
    return next();
  }
  const summaryNode = findNodesByType(blockNode, 'summary');
  const summaryTextLength =
    summaryNode && summaryNode[0] ? summaryNode[0].text.length : 0;

  // Detail block should be deleted if the text length (excluding summary) is 0 or there are no other elements in the block.
  if (
    blockNode.nodes.size > 0 &&
    blockNode.text.length - summaryTextLength > 0
  ) {
    return handleBackspaceAndCheckOffsetInDetailsblock(
      blockNode,
      editor,
      next,
      node,
      start,
      summaryTextLength,
    );
  }

  event.preventDefault();
  return editor.removeNodeByKey(blockNode.key);
};

export default onBackspace;
