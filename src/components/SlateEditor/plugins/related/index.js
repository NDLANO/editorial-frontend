/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import RelatedArticleBox from './RelatedArticleBox';

export default () => {
  const schema = {
    document: {},
    blocks: {
      related: {
        isVoid: true,
        data: {},
      },
    },
  };

  /* eslint-disable react/prop-types */
  const renderNode = props => {
    const { node, editor } = props;

    const onRemoveClick = e => {
      e.stopPropagation();
      const next = editor.value.change().removeNodeByKey(node.key);
      editor.onChange(next);
    };

    switch (node.type) {
      case 'related':
        return <RelatedArticleBox onRemoveClick={onRemoveClick} {...props} />;
      default:
        return null;
    }
  };

  return {
    schema,
    renderNode,
  };
};
