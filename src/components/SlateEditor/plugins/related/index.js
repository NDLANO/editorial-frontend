/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import RelatedArticleBox from './RelatedArticleBox';
import defaultBlocks from '../../utils/defaultBlocks';

export default () => {
  const schema = {
    document: {},
    blocks: {
      related: {
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
              editor.withoutSaving(() => {
                editor
                  .moveToEndOfNode(error.child)
                  .insertBlock(defaultBlocks.defaultBlock);
              });
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
  const renderBlock = (props, editor, next) => {
    const { node } = props;

    const onRemoveClick = e => {
      e.stopPropagation();
      editor.removeNodeByKey(node.key);
    };

    switch (node.type) {
      case 'related':
        return <RelatedArticleBox onRemoveClick={onRemoveClick} {...props} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderBlock,
  };
};
