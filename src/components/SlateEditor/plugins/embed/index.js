/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import SlateFigure from './SlateFigure';

export default function createEmbedPlugin(locale) {
  const schema = {
    blocks: {
      embed: {
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
      case 'embed':
        return (
          <SlateFigure
            onRemoveClick={onRemoveClick}
            {...props}
            locale={locale}
          />
        );
      default:
        return null;
    }
  };

  return {
    schema,
    renderNode,
  };
}
