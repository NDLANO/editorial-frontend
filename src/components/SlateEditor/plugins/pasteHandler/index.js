/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Document } from 'slate';
import { getEventTransfer } from 'slate-react';

function PasteHandler() {
  return {
    schema: {},
    onPaste(event, change) {
      const { fragment, text } = getEventTransfer(event);

      if (!fragment) return change.insertText(text);

      const textNode = fragment.getLastText();
      const closestBlock = fragment.getClosestBlock(textNode.key);
      const newFragment = Document.create({
        nodes: [closestBlock],
        isVoid: false,
      });
      return change.insertFragment(newFragment);
    },
  };
}

export default PasteHandler;
