/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { claudeHaikuDefaults, invokeModel } from "../../../LLM/helpers";

const getRephrasing = async (prompt: string) => {
  try {
    return await invokeModel({ prompt: prompt, ...claudeHaikuDefaults });
  } catch (error) {
    console.error(error);
  }
};

export const insertRephrase = async (editor: Editor, prompt: string) => {
  if (editor.selection === null) return;
  const selectedText = Editor.string(editor, editor.selection);
  if (!selectedText) return;
  const rephrasedText = await getRephrasing(prompt + selectedText);

  // const text = editorValueToPlainText(editor.selection);
};
