import isHotkey from 'is-hotkey';
import { Editor } from 'slate';
import { BLOCK_PICKER_TRIGGER_ID } from '../../../../constants';

const isBlockPickerHotkey = isHotkey('mod+Enter');

export const blockPickerPlugin = (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown } = editor;
  editor.shouldShowBlockPicker = () => true;

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (isBlockPickerHotkey(e)) {
      const el = document.getElementById(BLOCK_PICKER_TRIGGER_ID);
      if (el && !el.hidden) {
        e.preventDefault();
        e.stopPropagation();
        el.click();
      } else {
        nextOnKeyDown?.(e);
      }
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };
  return editor;
};
