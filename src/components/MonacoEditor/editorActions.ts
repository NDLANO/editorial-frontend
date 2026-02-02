/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { editor, KeyMod, KeyCode } from "monaco-editor/esm/vs/editor/editor.api";

export const createFormatAction = (): editor.IActionDescriptor => {
  return {
    id: "oxfmt",
    label: "Format",

    keybindings: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyF],

    contextMenuGroupId: "modification",
    contextMenuOrder: 1.5,

    run: async (editor) => {
      const model = editor.getModel();
      if (!model) return;
      const data = await fetch(`/format-html`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: model.getValue() ?? "" }),
      });
      const { html } = await data.json();
      model.setValue(html);

      return;
    },
  };
};

export const createSaveAction = (onSave: (value: string) => void): editor.IActionDescriptor => {
  return {
    id: "save-article",
    label: "Save",

    keybindings: [KeyMod.CtrlCmd | KeyCode.KeyS],

    contextMenuGroupId: undefined,
    contextMenuOrder: 0,

    run: async (editor) => onSave(editor.getValue()),
  };
};
