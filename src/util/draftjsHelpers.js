/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ContentState, EditorState } from 'draft-js';

export const createEditorStateFromText = text => {
  if (text) {
    return EditorState.createWithContent(ContentState.createFromText(text));
  }
  return EditorState.createEmpty();
};

export const getPlainTextFromEditorState = editorState =>
  editorState.getCurrentContent().getPlainText();
