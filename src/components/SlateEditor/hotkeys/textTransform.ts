import { Editor, Transforms, Range } from 'new-slate';
import isHotkey from 'is-hotkey';

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

export const textTransformPlugin = (editor: Editor) => {
  editor.hotkeys = editor.hotkeys.concat(keyActions);
  return editor;
};

export const onKeyDownPlugin = (editor: Editor) => {
  editor.hotkeys = [];
  editor.onKeyDown = (e: any) => {
    editor.hotkeys.forEach(hotkey => {
      if (hotkey.isKey(e)) {
        hotkey.action(e, editor);
      }
    });
  };
  return editor;
};

export const savePlugin = (handleSubmit: () => void) => (editor: Editor) => {
  const isSaveHotkey = isHotkey('mod+s');
  editor.hotkeys = editor.hotkeys.concat([
    {
      isKey: e => isSaveHotkey(e),
      action: e => {
        e.preventDefault();
        handleSubmit();
      },
    },
  ]);
  return editor;
};
