// function getItemDepth(opts: Options, editor: Value, block?: Block): number {
//     const { document, startBlock } = editor.value;
//     block = block || startBlock;
//
//     const currentItem = editor.getCurrentItem(opts, block);
//     if (!currentItem) {
//         return 0;
//     }
//
//     const list = document.getParent(currentItem.key);
//
//     return 1 + getItemDepth(opts, editor, list);
// }
//
// export default getItemDepth;

import { Editor } from 'slate';

const getItemDepth = (editor: Editor): number => {
  const currentItem = getCurrentListItem(editor);

  if (!currentItem || currentItem.type !== 'list_item') {
    return 0;
  }
};
