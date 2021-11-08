/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms } from 'slate';
import isHotkey from 'is-hotkey';
import { ReactEditor } from 'slate-react';

const isSaveHotkey = isHotkey('mod+s');

const saveHotkeyPlugin = (handleSubmit: () => void) => (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown } = editor;
  editor.onKeyDown = (e: KeyboardEvent) => {
    if (isSaveHotkey(e)) {
      e.preventDefault();
      editor.lastSelection = editor.selection && { ...editor.selection };
      Transforms.collapse(editor, {
        edge: 'end',
      });

      if (editor.selection) {
        editor.lastSelectedBlock = Editor.node(editor, editor.selection)[0];
        ReactEditor.deselect(editor);
      }
      handleSubmit();
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };
  return editor;
};

export default saveHotkeyPlugin;
