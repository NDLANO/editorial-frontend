import { Editor } from 'new-slate';

const replaceConsecutiveChars = (
  event: KeyboardEvent,
  editor: Editor,
  char: string,
  replacement: string,
) => {
  const start = editor.selection?.anchor;
  if (start && start.offset > 0) {
    const startText = Editor.leaf(editor, start);
    const previousChar = startText[0].text.slice(start.offset - 1, start.offset);
    if (previousChar === char) {
      event.preventDefault();
      editor.deleteBackward('character');
      editor.insertText(replacement);
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
