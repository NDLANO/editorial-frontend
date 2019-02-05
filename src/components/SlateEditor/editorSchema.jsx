/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { Block } from 'slate';
import defaultBlocks from './utils/defaultBlocks';

export const getSchemaEmbed = node => node.get('data').toJS();

export const schema = {
  document: {
    nodes: [
      {
        match: [{ type: 'section' }],
        min: 1,
      },
    ],
  },
  blocks: {
    section: {
      first: { type: 'paragraph' },
      last: { type: 'paragraph' },
      nodes: [
        {
          match: [
            { type: 'paragraph' },
            { type: 'embed' },
            { type: 'table' },
            { type: 'heading-two' },
            { type: 'heading-three' },
            { type: 'bulleted-list' },
            { type: 'numbered-list' },
            { type: 'letter-list' },
            { type: 'two-column-list' },
            { type: 'related' },
            { type: 'details' },
            { type: 'bodybox' },
            { type: 'aside' },
            { type: 'quote' },
            { type: 'pre' },
            { type: 'br' },
            { type: 'mathml' },
          ],
        },
      ],
      normalize: (editor, error) => {
        console.log(error.code);
        switch (error.code) {
          case 'first_child_type_invalid': {
            const block = Block.create(defaultBlocks.defaultBlock);
            editor.withoutSaving(() => {
              editor.insertNodeByKey(error.node.key, 0, block);
            });
            break;
          }
          case 'last_child_type_invalid': {
            const block = Block.create(defaultBlocks.defaultBlock);
            editor.withoutSaving(() => {
              editor.insertNodeByKey(
                error.node.key,
                error.node.nodes.size,
                block,
              );
            });
            break;
          }
          case 'child_min_invalid': {
            const block = Block.create(defaultBlocks.defaultBlock);
            editor.withoutSaving(() => {
              editor.insertNodeByKey(error.node.key, 0, block);
            });
            break;
          }
          case 'child_type_invalid':
            console.log(error.child);
            editor.wrapBlockByKey(error.child.key, 'paragraph');
            break;
          default:
            break;
        }
      },
    },
  },
  inlines: {
    span: {
      parent: {
        parent: { type: 'list' },
      },
    },
  },
};
