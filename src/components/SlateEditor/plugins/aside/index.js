/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Block } from 'slate';
import { defaultBlock } from '../../schema';
import SlateAside from './SlateAside';

export const defaultAsideBlock = type =>
  Block.create({
    data: { type },
    isVoid: false,
    type: 'aside',
    nodes: Block.createList([defaultBlock]),
  });

export default function createAside() {
  const schema = {
    document: {},
  };

  // Rule to always insert a paragraph as the last node inside if void type
  function validateNode(node) {
    if (node.kind !== 'block') return null;
    if (node.type !== 'aside') return null;
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
      case 'aside':
        return <SlateAside {...props} />;
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
