import { KeyboardEvent } from 'react';
import { Editor } from 'new-slate';
import { isMarkActive } from './index';

export const toggleMark = (
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  format: string,
) => {
  event.preventDefault();
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
