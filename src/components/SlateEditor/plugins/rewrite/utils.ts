/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";

export const insertRewrite = (editor: Editor) => {
  // console.log(editor.selection);
  if (editor.selection !== null) {
    const selectedText = Editor.string(editor, editor.selection);
    // console.log(selectedText);
  }
  // const text = editorValueToPlainText(editor.selection);
};
