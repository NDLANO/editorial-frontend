import { Editor, Transforms, Range } from 'new-slate';

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

const keyActions = [
  {
    isKey: (e: KeyboardEvent) => e.key === '<',
    action: (e: KeyboardEvent, editor: Editor) => replaceConsecutiveChars(e, editor, '<', '«'),
  },
  {
    isKey: (e: KeyboardEvent) => e.key === '>',
    action: (e: KeyboardEvent, editor: Editor) => replaceConsecutiveChars(e, editor, '>', '»'),
  },
];

export default keyActions;
