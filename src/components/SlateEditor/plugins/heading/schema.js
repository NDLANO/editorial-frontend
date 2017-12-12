/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import React from 'react';

const schema = {};

/* eslint-disable react/prop-types */
const renderNode = props => {
  const { node } = props;
  switch (node.type) {
    case 'heading-one':
      return <h1 {...props.attributes}>{props.children}</h1>;
    case 'heading-two':
      return <h2 {...props.attributes}>{props.children}</h2>;
    case 'heading-three':
      return <h3 {...props.attributes}>{props.children}</h3>;
    case 'heading-four':
      return <h4 {...props.attributes}>{props.children}</h4>;
    case 'heading-five':
      return <h5 {...props.attributes}>{props.children}</h5>;
    case 'heading-six':
      return <h6 {...props.attributes}>{props.children}</h6>;
    default:
      return null;
  }
};

export { schema, renderNode };
