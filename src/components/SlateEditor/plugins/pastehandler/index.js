/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getEventTransfer } from 'slate-react';

function pasteHandler() {
  return {
    schema: {},
    onPaste(event, editor, next) {
      const transfer = getEventTransfer(event);
      if (transfer.type === 'fragment') {
        // Dersom path < 4 la slate håndtere innliming.
        // if (editor.value.selection.focus.path.size < 4) return next();
        // Dersom du limer inn på et lavere, er du inne i en komponent og treng berre teksten.
        //return editor.insertText(transfer.text);
      }
      return next();
    },
  };
}

export default pasteHandler;
