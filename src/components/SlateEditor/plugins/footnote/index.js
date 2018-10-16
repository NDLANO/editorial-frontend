/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Footnote from './Footnote';

export const TYPE = 'footnote';

export default function footnotePlugin() {
  const schema = {
    document: {},
  };

  /* eslint-disable react/prop-types */
  const renderNode = props => {
    const { node, editor } = props;
    const { value } = editor.props;

    switch (node.type) {
      case TYPE:
        return <Footnote {...props} value={value} />;
      default:
        return null;
    }
  };

  return {
    schema,
    renderNode,
  };
}
