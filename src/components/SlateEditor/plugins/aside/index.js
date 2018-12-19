/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Block } from 'slate';
import { defaultBlocks, textBlockValidationRules } from '../../utils';
import SlateAside from './SlateAside';

export default function createAside() {
  const schema = {
    blocks: {
      aside: textBlockValidationRules,
    },
  };

  // Rule to always insert a paragraph as the last node inside if void type
  function validateNode(node, editor, next) {
    if (node.object !== 'block') return next();
    if (node.type !== 'aside') return next();
    if (!node.nodes.last().type) return next();
    if (!node.nodes.last().isVoid) return next();

    const block = Block.create(defaultBlocks.defaultBlock);
    return change => {
      change.insertNodeByKey(node.key, node.nodes.size, block);
    };
  }

  /* eslint-disable react/prop-types */
  const renderNode = (props, editor, next) => {
    const { node } = props;
    switch (node.type) {
      case 'aside':
        return <SlateAside {...props} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderNode,
    validateNode,
  };
}
