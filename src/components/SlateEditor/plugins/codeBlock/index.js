/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import CodeBlock from './CodeBlock';

const schema = {
  document: {},
  blocks: {
    codeBlock: {
      data: {},
    },
  },
}; // dette er en slate-ting

export const TYPE = 'code-block';

export default function codeBlockPlugin() {
  const renderInline = (props, editor, next) => {
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
    renderInline,
  };
}
