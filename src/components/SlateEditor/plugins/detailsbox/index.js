/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Block } from 'slate';
import DetailsBox from './DetailsBox';
import { defaultBlocks } from '../../utils';

const detailsBlock = [
  {
    type: 'summary',
    data: {},
  },
];

/* eslint-disable react/prop-types */
export const defaultDetailsBlock = () =>
  Block.create({
    type: 'details',
    nodes: Block.createList(detailsBlock),
  });

export default function createDetails() {
  const schema = {
    blocks: {
      // We can't use textBlockValidationRules for <details> because it wraps <summary>. Just
      // use last child rule for now, but we should refactor to use a more suited representation
      // which separates summary from details.
      details: {
        last: { type: 'paragraph' },
        normalize: (editor, error) => {
          switch (error.code) {
            case 'last_child_type_invalid': {
              const block = Block.create(defaultBlocks.defaultBlock);
              editor.withoutSaving(() => {
                editor.insertNodeByKey(
                  error.node.key,
                  error.node.nodes.size,
                  block,
                );
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
  const renderNode = (props, editor, next) => {
    const { node } = props;
    switch (node.type) {
      case 'details':
        return <DetailsBox {...props}>{props.children}</DetailsBox>;
      case 'summary':
        return <summary {...props.attributes}>{props.children}</summary>;
      default:
        return next();
    }
  };

  return {
    schema,
    renderNode,
  };
}
