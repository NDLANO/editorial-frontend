/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { MathML } from './MathML';

export const TYPE = 'mathml';

const schema = {
  document: {},
  blocks: {
    mathml: {
      isVoid: true,
    },
  },
};
export default function mathmlPlugin() {
  const renderNode = (props, editor, next) => {
    const { node } = props;

    switch (node.type) {
      case TYPE:
        return <MathML {...props} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderNode,
  };
}
