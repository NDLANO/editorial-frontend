import { Editor, Range, Transforms } from 'slate';
import { LIST_TYPES } from '../';
import { defaultListBlock } from './defaultBlocks';

export const wrapInList = (editor: Editor, type: string) => {
  const listType = type ? type : LIST_TYPES[0];
  const listElement = defaultListBlock(listType);
  Editor.withoutNormalizing(editor, () => {
    if (!Range.isRange(editor.selection)) {
      return;
    }
    Transforms.wrapNodes(editor, listElement);
  });
};
