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
      const transfer = getEventTransfer(event);
      const textNode = transfer.fragment.getLastText();
      const closestBlock = transfer.fragment.getClosestBlock(textNode.key);
      const newFragment = Document.create({
        nodes: [closestBlock],
        isVoid: false,
      });
      return change.insertFragment(newFragment);
    },
  };
}

export default PasteHandler;
