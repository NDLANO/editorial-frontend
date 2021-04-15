import { KeyboardEvent } from 'react';
import { Editor } from 'new-slate';
import isHotkey from 'is-hotkey';

const isSaveHotkey = isHotkey('mod+s');

export const saveHotkeyPlugin = (handleSubmit: () => void) => (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown } = editor;
  editor.onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isSaveHotkey(e)) {
      e.preventDefault();
      handleSubmit();
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };
  return editor;
};

export default saveHotkeyPlugin;
