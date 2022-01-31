/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Range } from 'slate';
import { KEY_ENTER } from '../../utils/keys';

const replaceConsecutiveChars = (
  event: KeyboardEvent,
  editor: Editor,
  char: string,
  replacement: string,
) => {
  if (editor.selection) {
    const start = Range.isForward(editor.selection)
      ? editor.selection?.anchor
      : editor.selection?.focus;
    if (start.offset > 0) {
      const startText = Editor.leaf(editor, start);
      const previousChar = startText[0].text.slice(start.offset - 1, start.offset);
      if (previousChar === char) {
        event.preventDefault();
        Transforms.move(editor, {
          distance: 1,
          reverse: true,
          edge: 'start',
        });
        editor.deleteBackward('character');
        editor.insertText(replacement);
      }
    }
  }
};

export const textTransformPlugin = (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown } = editor;

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === '<') {
      replaceConsecutiveChars(e, editor, '<', '«');
    } else if (e.key === '>') {
      replaceConsecutiveChars(e, editor, '>', '»');
    } else if (e.shiftKey === true && e.key === KEY_ENTER) {
      e.preventDefault();
      editor.insertText('\n');
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  return editor;
};
