/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import FileList from './FileList';

export default () => {
  const schema = {
    document: {},
  };

  /* eslint-disable react/prop-types */
  const renderNode = props => {
    const { node } = props;
    console.log(node.type);
    switch (node.type) {
      case 'file':
        return <FileList {...props} />;
      default:
        return null;
    }
  };

  return {
    schema,
    renderNode,
  };
};
