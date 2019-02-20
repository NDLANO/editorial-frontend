/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import SlateFigure from './SlateFigure';
import defaultBlocks from '../../utils/defaultBlocks';

export default function createEmbedPlugin(locale) {
  const schema = {
    blocks: {
      embed: {
        isVoid: true,
        data: {},
        next: [
          {
            type: 'paragraph',
          },
          { type: 'heading-two' },
          { type: 'heading-three' },
        ],
        normalize: (editor, error) => {
          switch (error.code) {
            case 'next_sibling_type_invalid': {
              editor
                .moveToEndOfNode(error.child)
                .insertBlock(defaultBlocks.defaultBlock);
              break;
            }
            default:
              break;
          }
        },
      },
    },
  };

  /* eslint-disable react/prop-types */
  const renderNode = (props, editor, next) => {
    const { node } = props;
    const onRemoveClick = e => {
      e.stopPropagation();
      editor.removeNodeByKey(node.key);
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
        return next();
    }
  };

  return {
    schema,
    renderNode,
  };
}
