import { Editor, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { ListItemElement } from '..';

export const isListItemSelected = (editor: Editor, node: ListItemElement) => {
  if (!Range.isRange(editor.selection)) return false;

  if (Range.includes(editor.selection, [...ReactEditor.findPath(editor, node), 0, 0])) {
    return true;
  }
  return false;
};
