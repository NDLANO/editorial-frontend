/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Block } from 'slate';
import RelatedArticleBox from './RelatedArticleBox';
import { defaultBlock } from '../../schema';

export const defaultRelatedBox = () =>
  Block.create({
    isVoid: false,
    type: 'related',
    nodes: Block.createList([defaultBlock]),
  });

export default function createRelatedBox() {
  const schema = {
    document: {},
  };

  // Rule to always insert a paragraph as the last node inside if void type
  function validateNode(node) {
    if (node.kind !== 'block') return null;
    if (node.type !== 'bodybox') return null;
    if (!node.nodes.last().type) return null;
    if (!node.nodes.last().isVoid) return null;

    const block = Block.create(defaultBlock);
    return change => {
      change.insertNodeByKey(node.key, node.nodes.size, block);
    };
  }

  const onKeyDown = (event, change) => {
    console.log(change);
    return true;
  };

  const onFocus = (event, change) => {
    console.log(event.target);
    console.log(change.value);
  };

  /* eslint-disable react/prop-types */
  const renderNode = props => {
    const { node } = props;
    console.log(props);
    switch (node.type) {
      case 'related':
        return <RelatedArticleBox {...props} />;
      default:
        return null;
    }
  };

  return {
    schema,
    renderNode,
    onKeyDown,
    onFocus,
    validateNode,
  };
}
