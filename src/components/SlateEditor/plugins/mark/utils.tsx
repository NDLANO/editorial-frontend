/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent } from 'react';
import { Editor } from 'new-slate';
import { isMarkActive } from './index';

export const toggleMark = (
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  format: string,
) => {
  event.preventDefault();
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
