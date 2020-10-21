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
  start: Point,
): boolean => {
  const document = editor.value.document;
  const nextText = document.getNextText(node.key);
  if (nextText === null) return false;
  const nextTextParent = document.getParent(nextText.key);
  if (nextTextParent === null) return false;
  const nextTextGrandparent = document.getParent(nextTextParent.key);
  const isInTheMiddleOfText = start.offset < node.text.length;

  return (
    // 1. checks if the next textline is part of the same component
    (blockNode.text.includes(nextText.text) || isInTheMiddleOfText) &&
    // 2. checks if the next textline shares the same grandparent
    (blockNode === nextTextGrandparent || isInTheMiddleOfText) &&
    // 3. prevent delete if the cursor is at the end of the text solution/details element a.k.a
    // if the is nothing to delete in the current element.
    // we are preventing the text outside of current element from jumping in the current cursor position
    (start.offset !== 0 || node.text.length !== 0) &&
    // 4. do nothing if the cursor is in summary
    paragraphNode?.type !== 'summary'
  );
};

const onDelete = (editor: Editor, next: () => void): void => {
  const { value } = editor;
  const { start, isCollapsed } = value.selection;
  const node = value.document.getNode(value.selection.anchor.path);

  if (node === null) return;
  const nextNode = editor.value.document.getNextNode(node.key) as ParentNode;
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
        start,
      )
    ) {
      return next();
    }
  } else {
    // only delete on text and if the next node is text node
    // or the cursor is in the middle of a text
    if (
      nextNode?.type === 'paragraph' ||
      nextNode?.type === 'br' ||
      start.offset < node.text.length
    ) {
      return next();
    }
  }
};

export default onDelete;
