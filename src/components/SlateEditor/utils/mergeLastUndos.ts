import { Editor } from 'slate';

const mergeLastUndos = (editor: Editor) => {
  const arr = editor.history.undos;
  const newest = arr.pop();
  const older = arr[arr.length - 1];

  const newObject = {
    operations: older?.operations.concat(newest?.operations || []) || newest?.operations || [],
    selectionBefore: older.selectionBefore || newest?.selectionBefore || null,
  };
  arr[arr.length - 1] = newObject;
};

export default mergeLastUndos;
