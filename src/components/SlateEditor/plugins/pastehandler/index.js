/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getEventTransfer } from 'slate-react';
import { getTopNode } from '../DND/utils';

function pasteHandler() {
  return {
    schema: {},
    onPaste(event, editor, next) {
      const transfer = getEventTransfer(event);
      if (transfer.type === 'fragment') {
        const target = editor.findNode(event.target);
        const topLevelTarget = getTopNode(target, editor);
        if (topLevelTarget.type === 'paragraph') {
          if (topLevelTarget.text === '') {
            // Only support pasting fragment into empty p for now
            return editor.insertFragmentByKey(topLevelTarget.key, 0, transfer.fragment);
          } else {
            // Extract text and append to p
            return editor.insertText(transfer.text);
          }
        }
      }
      return next();
    },
  };
}

export default pasteHandler;
