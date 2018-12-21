/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { TYPE } from './type';

export function getCurrentParagraph(value) {
  if (!value.selection.start.key) return null;
  const { startBlock } = value;
  return startBlock && startBlock.type === 'paragraph' ? startBlock : null;
}

export function onEnter(evt, editor, next) {
  const currentParagraph = getCurrentParagraph(editor.value);
  if (!currentParagraph) {
    return next();
  }
  evt.preventDefault();
  /**
   If the user types enter in an empty paragraph we transform the paragraph to a <br>.
   This enables us to filter out unnecessary empty <p> tags on save. We insert empty p tags
   throughout the document to enable positioning the cursor between element with no
   spacing (i.e two images).
   */
  if (currentParagraph.text === '') {
    return editor
      .delete()
      .insertBlock('br')
      .insertBlock(TYPE);
  }

  if (evt.shiftKey === true) {
    return editor.insertText('\n');
  }

  return editor.insertBlock(TYPE);
}
