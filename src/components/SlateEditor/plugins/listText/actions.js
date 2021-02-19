/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

export function getCurrentListText(value) {
  if (!value.selection.start.key) return null;
  const { startBlock } = value;
  return startBlock && startBlock.type === 'list-text' ? startBlock : null;
}

export function onEnter(evt, editor, next) {
  const currentListText = getCurrentListText(editor.value);
  if (!currentListText || !evt.shiftKey) {
    return next();
  }
  evt.preventDefault();
  /**
   If the user types enter in an empty paragraph we transform the paragraph to a <br>.
   This enables us to filter out unnecessary empty <p> tags on save. We insert empty p tags
   throughout the document to enable positioning the cursor between element with no
   spacing (i.e two images).
   */
  return editor.insertText('\n');
}
