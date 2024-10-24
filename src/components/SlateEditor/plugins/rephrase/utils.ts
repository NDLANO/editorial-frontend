/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { invokeModel } from "../../../LLM/helpers";

export const insertRephrase = (editor: Editor) => {
  if (editor.selection === null) return;
  const selectedText = Editor.string(editor, editor.selection);
  // console.log(selectedText);

  // const text = editorValueToPlainText(editor.selection);
};
