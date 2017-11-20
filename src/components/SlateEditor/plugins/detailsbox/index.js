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
// import Summary from './Summary';

const detailsBlock = [
  {
    type: 'summary',
    isVoid: false,
    data: {},
  },
  {
    type: 'paragraph',
    isVoid: false,
    data: {},
  },
];

/* eslint-disable react/prop-types */
export const defaultDetailsBlock = () =>
  Block.create({
    isVoid: false,
    type: 'details',
    nodes: Block.createList(detailsBlock),
  });

export default function createDetails() {
  const schema = {
    nodes: {
      details: DetailsBox,
      summary: props => (
        <summary {...props.attributes}>{props.children}</summary>
      ),
    },
  };

  return {
    schema,
  };
}
