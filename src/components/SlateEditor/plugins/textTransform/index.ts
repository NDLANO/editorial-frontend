import { KeyboardEvent } from 'react';
import { Editor, Transforms, Range } from 'new-slate';

const replaceConsecutiveChars = (
  event: KeyboardEvent<HTMLDivElement>,
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

  editor.onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === '<') {
      replaceConsecutiveChars(e, editor, '<', '«');
    } else if (e.key === '>') {
      replaceConsecutiveChars(e, editor, '>', '»');
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  return editor;
};

export default textTransformPlugin;
