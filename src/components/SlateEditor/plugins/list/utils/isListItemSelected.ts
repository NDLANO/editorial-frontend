/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Path, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { ListItemElement } from '..';

export const isListItemSelected = (editor: Editor, node: ListItemElement) => {
  if (!Range.isRange(editor.selection)) return false;

  if (Range.includes(editor.selection, [...ReactEditor.findPath(editor, node), 0])) {
    return true;
  }
  return false;
};

export const isListItemPathSelected = (editor: Editor, path: Path) => {
  if (!Range.isRange(editor.selection)) return false;

  if (Range.includes(editor.selection, [...path, 0])) {
    return true;
  }
  return false;
};
