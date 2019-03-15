/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Block } from 'slate';
import DetailsBox from './DetailsBox';
import { defaultBlocks } from '../../utils';
import Summary from './Summary';

const detailsBlock = [
  {
    type: 'summary',
    data: {},
  },
  defaultBlocks.defaultBlock,
];

/* eslint-disable react/prop-types */
export const defaultDetailsBlock = () =>
  Block.create({
    type: 'details',
    nodes: Block.createList(detailsBlock),
  });

export default function createDetails() {
  const schema = {
    blocks: {
      summary: {
        isVoid: true,
      },
      details: {
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
            case 'next_sibling_type_invalid': {
              editor.withoutNormalizing(() => {
                editor.wrapBlockByKey(error.child.key, 'section');
                const wrapper = editor.value.document.getParent(
                  error.child.key,
                );
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
      },
    },
  };

  /* eslint-disable react/prop-types */
  const renderNode = (props, editor, next) => {
    const { node } = props;
    switch (node.type) {
      case 'details':
        return <DetailsBox {...props} />;
      case 'summary':
        return <span>{node.text}</span>;
      default:
        return next();
    }
  };

  return {
    schema,
    renderNode,
  };
}
