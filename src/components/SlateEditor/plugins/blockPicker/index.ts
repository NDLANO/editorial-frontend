import { Editor } from 'slate';

export const blockPickerPlugin = (editor: Editor) => {
  editor.shouldShowToolbar = () => true;

  return editor;
};
