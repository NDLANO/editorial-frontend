/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Block } from 'slate';
import SlateBodyBox from './SlateBodyBox';
import { defaultBlocks } from '../../utils';

const { defaultBlock } = defaultBlocks;

export const defaultBodyBoxBlock = () =>
  Block.create({
    type: 'bodybox',
    nodes: Block.createList([defaultBlock]),
  });

export default function createBodyBox() {
  const schema = {
    document: {},
  };

  // Rule to always insert a paragraph as the last node inside if void type
  function validateNode(node) {
    if (node.object !== 'block') return null;
    if (node.type !== 'bodybox') return null;
    if (!node.nodes.last().type) return null;
    if (!node.nodes.last().isVoid) return null;

    const block = Block.create(defaultBlock);
    return change => {
      change.insertNodeByKey(node.key, node.nodes.size, block);
    };
  }

  /* eslint-disable react/prop-types */
  const renderNode = props => {
    const { node } = props;
    switch (node.type) {
      case 'bodybox':
        return <SlateBodyBox {...props} />;
      default:
        return null;
    }
  };

  return {
    schema,
    renderNode,
    validateNode,
  };
}
