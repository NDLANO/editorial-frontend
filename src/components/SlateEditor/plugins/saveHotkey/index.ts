/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isHotkey from "is-hotkey";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { SAVE_BUTTON_ID } from "../../../../constants";

const isSaveHotkey = isHotkey("mod+s");

const saveHotkeyPlugin = (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown } = editor;
  editor.onKeyDown = (e) => {
    if (isSaveHotkey(e)) {
      e.preventDefault();
      editor.lastSelection = editor.selection && { ...editor.selection };
      Transforms.collapse(editor, {
        edge: "end",
      });

      if (editor.selection) {
        editor.lastSelectedBlock = Editor.node(editor, editor.selection)[0];
        ReactEditor.deselect(editor);
      }
      document.getElementById(SAVE_BUTTON_ID)?.click();
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };
  return editor;
};

export default saveHotkeyPlugin;
