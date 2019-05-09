/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';

/* eslint-disable react/prop-types */
const renderNode = (props, editor, next) => {
  const { node, attributes } = props;
  switch (node.type) {
    case 'dndCaret':
      return (
        <div {...attributes} style={{ width: '10px', height: '10px', background: 'red' }} />
      );
    default:
      return next();
  }
};

export default renderNode;
