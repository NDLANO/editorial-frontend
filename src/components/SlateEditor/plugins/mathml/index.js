/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import MathEditor from './MathEditor';

export const TYPE = 'mathml';

const schema = {
  document: {},
  blocks: {
    mathml: {
      isVoid: true,
      data: {},
    },
  },
};

export default function mathmlPlugin() {
  const renderInline = (props, editor, next) => {
    const { node } = props;

    switch (node.type) {
      case TYPE:
        return <MathEditor {...props} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderInline,
  };
}
