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
      const { text } = transfer;
      console.log(transfer.fragment);
      console.log('pasting text: ', text);
      const textNode = transfer.fragment.getLastText();
      console.log('textNode', textNode);
      const closestBlock = transfer.fragment.getClosestBlock(textNode.key);
      console.log(closestBlock);

      const newFragment = Document.create({
        nodes: [closestBlock],
        isVoid: false,
      });
      console.log('newFragment', newFragment);
      return change.insertFragment(newFragment);
    },
  };
}

export default PasteHandler;
