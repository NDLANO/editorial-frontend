/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { hasNodeOfType } from '../../utils';
import { listTypes } from '../externalPlugins';

const DEFAULT_NODE = 'paragraph';

export function handleClickBlock(event, editor, type) {
  event.preventDefault();
  stripSpacesFromSelectedText(editor);

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

export function handleClickMark(event, editor, type) {
  event.preventDefault();
  stripSpacesFromSelectedText(editor);
  editor.toggleMark(type);
}

export function handleClickInline(event, editor, type) {
  event.preventDefault();
  stripSpacesFromSelectedText(editor);

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

/**
 * Default windows behaviour when selecting text via double click is to select the word + the following space.
 * This function checks the selected text and removes 1 space from each end.
 * Selections spanning more than one text is supported.
 */
function stripSpacesFromSelectedText(editor) {
  const { value } = editor;
  if (value.selection.start.offset === value.selection.end.offset) {
    return;
  }
  const { startText, endText } = value;
  const selectedStartText = startText.text.slice(value.selection.start.offset);
  if (selectedStartText.startsWith(' ')) {
    editor.moveStartForward(1);
  }
  const selectedEndText = endText.text.slice(-value.selection.end.offset);
  if (selectedEndText.endsWith(' ')) {
    editor.moveEndBackward(1);
  }
}
