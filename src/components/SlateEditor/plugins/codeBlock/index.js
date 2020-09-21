/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import CodeBlock from './CodeBlock';
import { defaultBlocks } from '../../utils';

export const TYPE = 'code-block';

export default () => {
  const schema = {
    document: {},
    blocks: {
      codeBlock: {
        data: {},
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
