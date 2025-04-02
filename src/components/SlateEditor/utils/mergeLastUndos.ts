/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";

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
