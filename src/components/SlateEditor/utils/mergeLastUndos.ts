import { Editor } from 'slate';

const mergeLastUndos = (editor: Editor) => {
  const arr = editor.history.undos;
  const tail = arr.pop() || [];
  arr[arr.length - 1] = arr[arr.length - 1].concat(tail);
};

export default mergeLastUndos;
