/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isHotkey } from "is-hotkey";
import { Editor } from "slate";
import { BLOCK_PICKER_TRIGGER_ID } from "../../../../constants";

const isBlockPickerHotkey = isHotkey("mod+Enter");

export const blockPickerPlugin = (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown } = editor;

  editor.onKeyDown = (e) => {
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
