/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Block, Document, Editor, Inline, Node, Point } from 'slate';
import { findNodesByType } from '../../../../util/slateHelpers';

type ParentNode = Document | Block | Inline | null;

const shouldDeleteIfInsideOfDetailsblock = (
  blockNode: Node,
  editor: Editor,
  node: Node,
  paragraphNode: ParentNode,
  start: Point,
): boolean => {
  const document = editor.value.document;
  const nextText = document.getNextText(node.key);
  if (nextText === null) return false;
  const nextTextParent = document.getParent(nextText.key);
  if (nextTextParent === null) return false;
  const nextTextGrandparent = document.getParent(nextTextParent.key);
  const isInTheMiddleOfText = start.offset <= node.text.length;

  return (
    // 1. checks if the next textline is part of the same component
    (blockNode.text.includes(nextText.text) || isInTheMiddleOfText) &&
    // 2. checks if the next textline shares the same grandparent
    (blockNode === nextTextGrandparent || isInTheMiddleOfText) &&
    // 3. prevent delete if the cursor is at the end of the text solution/details element a.k.a
    // if the is nothing to delete in the current element.
    // we are preventing the text outside of current element from jumping in the current cursor position
    (start.offset !== 0 || node.text.length !== 0 || isInTheMiddleOfText) &&
    // 4. do nothing if the cursor is in summary
    paragraphNode?.type !== 'summary'
  );
};

const onDelete = (
  editor: Editor,
  event: KeyboardEvent,
  next: () => void,
): void | Editor => {
  const { value } = editor;
  const { anchor, isCollapsed, start } = value.selection;
  const node = value.document.getNode(anchor.path);
  if (node === null) return;

  const paragraphNode = value.document.getParent(node.key) as ParentNode;
  if (paragraphNode === null) return;

  const blockNode = value.document.getParent(paragraphNode.key) as ParentNode;
  if (blockNode === null) return;

  const nodePosition = anchor.offset;
  const nodeOffset = editor.value.document.getOffset(node.key);
  const parentNode = value.document.getParent(node.key);
  if (parentNode === null) return;
  const parentOffset = editor.value.document.getOffset(parentNode.key);

  // Checks if cursor is at end of text in paragraph. If not let slate handle.
  if (nodeOffset + nodePosition !== parentOffset + parentNode.text.length) {
    return next();
  }

  // Check if next sibling is a details. If not let slate handle.
  const nextSiblingNode = value.document.getNextSibling(
    parentNode.key,
  ) as ParentNode;
  if (nextSiblingNode === null) return;

  if (blockNode?.type === 'details' || !isCollapsed) {
    if (
      shouldDeleteIfInsideOfDetailsblock(
        blockNode,
        editor,
        node,
        paragraphNode,
        start,
      )
    ) {
      return next();
    }
  } else if (nextSiblingNode?.type !== 'details' || !isCollapsed) {
    return next();
  }

  const summaryNodes = findNodesByType(nextSiblingNode, 'summary');
  const summaryLength = summaryNodes?.[0]?.text?.length || 0;

  event.preventDefault();
  // Detail block should only be deleted if the text length (excluding summary) is 0 or there are no other elements in the block.
  if (
    nextSiblingNode?.nodes.size === 0 ||
    nextSiblingNode?.text.length - summaryLength === 0
  ) {
    return editor.removeNodeByKey(nextSiblingNode?.key);
  }
};

export default onDelete;
