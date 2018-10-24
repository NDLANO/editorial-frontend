/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { TYPE } from '.';

export function getCurrentParagraph(value) {
  if (!value.selection.start.key) return null;
  const { startBlock } = value;
  return startBlock && startBlock.type === 'paragraph' ? startBlock : null;
}

export function onEnter(evt, change) {
  const currentParagraph = getCurrentParagraph(change.value);
  if (!currentParagraph) {
    return null;
  }
  evt.preventDefault();
  /**
   If the user types enter in an empty paragraph we transform the paragraph to a <br>.
   This enables us to filter out unnecessary empty <p> tags on save. We insert empty p tags
   throughout the document to enable positioning the cursor between element with no
   spacing (i.e two images).
   */
  if (currentParagraph.text === '') {
    return change
      .delete()
      .insertBlock('br')
      .insertBlock(TYPE);
  }

  if (evt.shiftKey === true) {
    return change.insertText('\n');
  }

  return change.insertBlock(TYPE);
}
