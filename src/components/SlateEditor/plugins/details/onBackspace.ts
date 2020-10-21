/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Block, Document, Editor, Inline, Node, Point } from 'slate';

type ParentNode = Document | Block | Inline | null;

const shouldDeleteIfInsideOfDetailsblock = (
  blockNode: Node,
  editor: Editor,
  node: Node,
  paragraphNode: ParentNode,
  previousNode: ParentNode,
  start: Point,
): boolean => {
  const document = editor.value.document;
  const previousText = document.getPreviousText(node.key);
  if (previousText === null) return false;
  const previousTextParent = document.getParent(previousText.key);
  if (previousTextParent === null) return false;
  const previousTextGrandparent = document.getParent(previousTextParent.key);
  const isInTheMiddleOfText = start.offset < node.text.length;

  return (
    // 1. checks if the previous textline is part of the same component
    (blockNode.text.includes(previousText.text) || isInTheMiddleOfText) &&
    // 2. checks if the previous textline shares the same grandparent
    (blockNode === previousTextGrandparent || isInTheMiddleOfText) &&
    // 3. prevent delete with backspace if the cursor is at the start of the text solution/details element a.k.a
    // if the is nothing to delete in the current element.
    // we are preventing the deletion of non-text elements
    (start.offset !== 0 ||
      previousNode?.type === 'paragraph' ||
      previousNode?.type === 'br') &&
    // 4. do nothing if the cursor is in summary
    paragraphNode?.type !== 'summary'
  );
};

const onBackspace = (
  editor: Editor,
  event: KeyboardEvent,
  next: () => void,
): void => {
  const { value } = editor;
  const { start, isCollapsed } = value.selection;
  const node = value.document.getNode(value.selection.anchor.path);

  if (node === null) return;
  const previousNode = editor.value.document.getPreviousNode(
    node.key,
  ) as ParentNode;
  if (previousNode === null) return;
  const paragraphNode = value.document.getParent(node.key) as ParentNode;

  if (paragraphNode === null) return;
  const blockNode = value.document.getParent(paragraphNode.key) as ParentNode;
  if (blockNode === null) return;

  // is the cursor inside another element?
  if (
    blockNode.type === 'details' ||
    blockNode.type === 'solutionbox' ||
    !isCollapsed
  ) {
    if (
      shouldDeleteIfInsideOfDetailsblock(
        blockNode,
        editor,
        node,
        paragraphNode,
        previousNode,
        start,
      )
    ) {
      return next();
    }
  } else {
    // only delete text and if the previous node is text node
    // or the cursor is in the middle of a text
    if (
      previousNode.type === 'paragraph' ||
      previousNode.type === 'br' ||
      start.offset <= node.text.length
    ) {
      return next();
    }
  }
};

export default onBackspace;
