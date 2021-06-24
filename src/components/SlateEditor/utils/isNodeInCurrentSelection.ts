/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Range } from 'slate';
import { ReactEditor } from 'slate-react';

const isNodeInCurrentSelection = (editor: Editor, node: Descendant) => {
  if (!editor.selection) {
    return false;
  }
  const path = ReactEditor.findPath(editor, node);

  return Range.includes(editor.selection, path);
};

export default isNodeInCurrentSelection;
