/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Block } from 'slate';
import Html from 'slate-html-serializer';
import { getEventTransfer } from 'slate-react';

export function convertToSupportedBlockTypes(block) {
  switch (block.type) {
    case 'line':
      return Block.create({
        type: 'paragraph',
        nodes: block.nodes,
      });
    default:
      return block;
  }
}

function PasteHandler({ rules }) {
  return {
    schema: {},
    onPaste(event, change, next) {
      const { html, text, type } = getEventTransfer(event);
      if (type === 'html') {
        const serializer = new Html({ rules });
        const { document } = serializer.deserialize(html);
        return change.insertFragment(document);
      }
      return next();
    },
  };
}

export default PasteHandler;
