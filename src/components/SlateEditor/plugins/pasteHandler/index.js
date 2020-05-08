/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Document, Block } from 'slate';
import Html from "slate-html-serializer";
import { getEventTransfer } from 'slate-react';
import { RULES } from '../../../../util/slateHelpers';

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
  const serializer = new Html({ rules })
  return {
    schema: {},
    onPaste(event, change, next) {
      const {html, text, type} = getEventTransfer(event);
      if (type === 'html') {
        // TODO: Sanitize element attributes.
        const { document } = serializer.deserialize(html);
        return change.insertFragment(document);
      }
      if (type === 'text') return change.insertText(text);
      return next();
    },
  };
}

export default PasteHandler;
