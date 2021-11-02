import { Editor } from 'slate';

export const blockPickerPlugin = (editor: Editor) => {
  editor.shouldShowBlockPicker = () => true;

  return editor;
};
