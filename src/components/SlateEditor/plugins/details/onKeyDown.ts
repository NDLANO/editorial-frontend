/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'slate';
import onBackspace from './onBackspace';
import onDelete from './onDelete';

const KEY_BACKSPACE = 'Backspace';
const KEY_DELETE = 'Delete';

const onKeyDown = (
  event: KeyboardEvent,
  editor: Editor,
  next: () => void,
): Editor | void => {
  switch (event.key) {
    case KEY_BACKSPACE:
      return onBackspace(editor, event, next);
    case KEY_DELETE:
      return onDelete(editor, event, next);
    default:
      return next();
  }
};

export default onKeyDown;
