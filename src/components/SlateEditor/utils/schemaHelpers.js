/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { Block } from 'slate';
import defaultBlocks from './defaultBlocks';

export const textBlockValidationRules = {
  first: { type: 'paragraph' },
  nodes: [{ match: 'paragraph', min: 1 }],
  last: { type: 'paragraph' },
  next: [
    {
      type: 'paragraph',
    },
    { type: 'heading-two' },
    { type: 'heading-three' },
  ],
  normalize: (editor, error) => {
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
          editor.insertNodeByKey(error.node.key, error.node.nodes.size, block);
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
      case 'next_sibling_type_invalid': {
        editor.withoutSaving(() => {
          editor.wrapBlockByKey(error.child.key, 'section');
          const wrapper = editor.value.document.getParent(error.child.key);
          editor.insertNodeByKey(
            wrapper.key,
            1,
            Block.create(defaultBlocks.defaultBlock),
          );
          editor.unwrapBlockByKey(wrapper.key, 'section');
        });
        break;
      }
      default:
        break;
    }
  },
};
