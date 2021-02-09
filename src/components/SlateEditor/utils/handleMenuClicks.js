/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { hasNodeOfType } from '.';
import { listTypes } from '../plugins/externalPlugins';

const DEFAULT_NODE = 'paragraph';

function handleClickBlock(event, editor, type) {
  event.preventDefault();
  const { document, blocks } = editor.value;
  const isActive = hasNodeOfType(editor, type);
  if (type === 'quote') {
    if (editor.isSelectionInBlockquote()) {
      editor.unwrapBlockquote();
    } else {
      editor.wrapInBlockquote();
    }
  } else if (listTypes.includes(type)) {
    const isListTypeActive = blocks.some(
      block => !!document.getClosest(block.key, parent => parent.type === type),
    );
    // Current list type is active
    if (isListTypeActive) {
      editor.unwrapList();
      // Current selection is list, but not the same type
    } else if (editor.isSelectionInList()) {
      editor.unwrapList();
      editor.wrapInList(type);
      // No list found, wrap in list type
    } else {
      editor.wrapInList(type);
    }
  } else {
    editor.setBlocks(isActive ? DEFAULT_NODE : type);
  }
}

function handleClickMark(event, editor, type) {
  event.preventDefault();
  editor.toggleMark(type);
}

function handleClickInline(event, editor, type) {
  event.preventDefault();

  if (type === 'footnote') {
    addTextAndWrapIntype(editor, '#', type);
  } else if (type === 'mathml') {
    const { value } = editor;
    if (value.selection.start.offset !== value.selection.end.offset) {
      editor.wrapInline(type);
    } else {
      addTextAndWrapIntype(editor, ' ', type);
    }
  } else {
    editor.withoutNormalizing(() => {
      editor.wrapInline(type);
    });
  }
}

function addTextAndWrapIntype(editor, text, type) {
  editor
    .moveToEnd()
    .insertText(text)
    .moveFocusForward(-text.length)
    .wrapInline(type);
}

export { handleClickBlock, handleClickMark, handleClickInline };
