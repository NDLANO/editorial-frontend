/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from 'react';
import { Editor } from 'slate';
import { isMarkActive } from './index';
import { MarkType } from '../toolbar/toolbarState';

export const toggleMark = (
  event: KeyboardEvent | MouseEvent<HTMLButtonElement>,
  editor: Editor,
  format: MarkType,
) => {
  event.preventDefault();
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
