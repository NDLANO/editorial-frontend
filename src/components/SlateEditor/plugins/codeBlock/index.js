/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

//     <script type="text/javascript" src="../dist/enlighterjs.min.js"></script>
//     <link rel="stylesheet" href="../dist/enlighterjs.min.css" />

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
    console.log('hva er Node, codeBlock: ', node, 'typen:', node.type); // TODO 19. august hvorfor blir ikke denne lik som i matte?

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
