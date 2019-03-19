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
import { defaultBlocks, textBlockValidationRules } from '../../utils';

const { defaultBlock } = defaultBlocks;

export const defaultBodyBoxBlock = () =>
  Block.create({
    type: 'bodybox',
    nodes: Block.createList([defaultBlock]),
  });

export default function createBodyBox() {
  const schema = {
    blocks: {
      bodybox: textBlockValidationRules,
    },
  };

  /* eslint-disable react/prop-types */
  const renderNode = (props, editor, next) => {
    const { node } = props;
    switch (node.type) {
      case 'bodybox':
        return <SlateBodyBox {...props} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderNode,
  };
}
