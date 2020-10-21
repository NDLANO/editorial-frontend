/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { findNodesByType } from '../../../../util/slateHelpers';

function onDelete(event, editor, next) {
  const { value } = editor;
  const { anchor, isCollapsed } = value.selection;
  const node = value.document.getNode(anchor.path);
  const nodePosition = anchor.offset;
  const nodeOffset = editor.value.document.getOffset(node.key);
  const parentNode = value.document.getParent(node.key);
  const parentOffset = editor.value.document.getOffset(parentNode.key);

  // Checks if cursor is at end of text in paragraph. If not let slate handle.
  if (nodeOffset + nodePosition !== parentOffset + parentNode.text.length) {
    return next();
  }
  // Check if next sibling is a details. If not let slate handle.
  const blockNode = value.document.getNextSibling(parentNode.key);
  if (blockNode.type !== 'details' || !isCollapsed) {
    return next();
  }

  const summaryNodes = findNodesByType(blockNode, 'summary');
  const summaryLength = summaryNodes?.[0]?.text?.length || 0;

  event.preventDefault();
  // Detail block should only be deleted if the text length (excluding summary) is 0 or there are no other elements in the block.
  if (
    blockNode.nodes.size === 0 ||
    blockNode.text.length - summaryLength === 0
  ) {
    return editor.removeNodeByKey(blockNode.key);
  }
}

export default onDelete;
