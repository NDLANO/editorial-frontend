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

const schema = {}; // er dette en slate-ting?

export const TYPE = 'code-block';

export default function mathmlPlugin() {
  const renderInline = (props, editor, next) => {
    const { node } = props;

    switch (node.type) {
      case TYPE:
        return <TODO {...props} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderInline,
  };
}
