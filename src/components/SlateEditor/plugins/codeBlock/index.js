/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import CodeBlock from './CodeBlock';
import { Block } from 'slate';
import { defaultBlocks, textBlockValidationRules } from '../../utils';

const { defaultCodeBlock } = defaultBlocks;

export const TYPE = 'code-block';

export const defaultCodeBlockBlock = () =>
  // TODO: bedre nav
  Block.create({
    type: 'code-block',
    nodes: Block.createList([defaultCodeBlock]),
  });

export default function codeBlockPlugin() {
  const schema = {
    blocks: {
      codeBlock: textBlockValidationRules,
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
}
