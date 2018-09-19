/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getEventTransfer, cloneFragment } from 'slate-react';
import { findNodesByType } from '../../../../util/slateHelpers';

function PasteHandler() {
  return {
    schema: {},
    /*     onCopy(event, change) {
      const { value } = change;
      const { selection } = value;
      console.log(value);
      console.log(selection);
      const fragment = undefined; // ... create a fragment from a set of nodes ...
      console.log(value.document.getBlocksAtRange(selection));
      if (fragment) {
        cloneFragment(event, value, fragment);
        return true;
      }
      return;
    }, */
    onPaste(event, change) {
      const transfer = getEventTransfer(event);
      const { value } = change;
      const { text } = transfer;
      console.log(transfer.fragment);
      const { selection } = value;
      console.log('pasting text: ', text);
      const textNode = transfer.fragment.getLastText();
      const paragraph = findNodesByType(transfer.fragment, 'paragraph').pop();
      const insertBlock = value.document.getBlocksAtRange(selection);
      console.log(insertBlock);
      return change.insertText(text);
    },
  };
}

export default PasteHandler;
