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
import onKeyDown from './onKeyDown';
import SlateBlueprint from './SlateBlueprint';

const summaryBlock = (text = '') => [
  {
    type: 'summary',
    data: {},
    nodes: [
      {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text,
            marks: [],
          },
        ],
      },
    ],
  },
  defaultBlocks.defaultBlock,
];

const normalizer = {
  last: { type: 'paragraph' },
  next: [
    {
      type: 'paragraph',
    },
    { type: 'heading-two' },
    { type: 'heading-three' },
  ],
  normalize: (editor, error) => {
    console.log(error);
    switch (error.code) {
      case 'last_child_type_invalid': {
        const block = Block.create(defaultBlocks.defaultBlock);
        editor.withoutSaving(() => {
          editor.insertNodeByKey(error.node.key, error.node.nodes.size, block);
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

/* eslint-disable react/prop-types */
export const defaultDetailsBlock = () =>
  Block.create({
    type: 'details',
    nodes: Block.createList(summaryBlock('')),
  });

export const defaultBlueprintBlock = summaryText =>
  Block.create({
    type: 'blueprint',
    nodes: Block.createList(summaryBlock(summaryText)),
  });

export default function createDetails() {
  const schema = {
    blocks: {
      summary: {
        isVoid: true,
      },
      details: normalizer,
      blueprint: normalizer,
    },
  };

  /* eslint-disable react/prop-types */
  const renderNode = (props, editor, next) => {
    const { node } = props;
    console.log(props);
    switch (node.type) {
      case 'details':
        return <DetailsBox {...props} editor={editor} />;
      case 'blueprint':
        return <SlateBlueprint {...props} editor={editor} />;
      case 'summary':
        return <span {...props.attributes}>{node.text}</span>;
      default:
        return next();
    }
  };

  return {
    schema,
    renderNode,
    onKeyDown,
  };
}
