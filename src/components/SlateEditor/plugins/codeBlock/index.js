/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import CodeBlock from './CodeBlock';
import defaultBlocks from '../../utils/defaultBlocks';

export const TYPE = 'code-block';

export default () => {
  const schema = {
    blocks: {
      'code-block': {
        isVoid: true,
        data: {},
        next: [
          {
            type: 'paragraph',
          },
          { type: 'heading-two' },
          { type: 'heading-three' },
        ],
        normalize: (editor, error) => {
          switch (error.code) {
            case 'next_sibling_type_invalid': {
              editor.withoutSaving(() => {
                editor
                  .moveToEndOfNode(error.child)
                  .insertBlock(defaultBlocks.defaultBlock);
              });
              break;
            }
            default:
              break;
          }
        },
      },
    },
  };

  const renderBlock = (props, editor, next) => {
    const { node } = props;
    switch (node.type) {
      case TYPE:
        return <CodeBlock {...props} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderBlock,
  };
};
