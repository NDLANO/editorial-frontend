/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent } from 'react';
import { Editor } from 'new-slate';
import isHotkey from 'is-hotkey';
import { ReactEditor } from 'new-slate-react';

const isSaveHotkey = isHotkey('mod+s');

const saveHotkeyPlugin = (handleSubmit: () => void) => (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown } = editor;
  editor.onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isSaveHotkey(e)) {
      e.preventDefault();
      ReactEditor.deselect(editor);
      handleSubmit();
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };
  return editor;
};

export default saveHotkeyPlugin;
