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
    },
  },
};
export default function mathmlPlugin() {
  const renderNode = props => {
    const { node, editor } = props;

    const onRemoveClick = () => {
      const next = editor.value.change().removeNodeByKey(node.key);
      editor.onChange(next);
    };

    switch (node.type) {
      case TYPE:
        return <MathEditor onRemoveClick={onRemoveClick} {...props} />;
      default:
        return null;
    }
  };

  return {
    schema,
    renderNode,
  };
}
