/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Filelist from './Filelist';

export default () => {
  const schema = {
    document: {},
  };

  /* eslint-disable react/prop-types */
  const renderNode = (props, editor, next) => {
    const { node } = props;
    switch (node.type) {
      case 'file':
        return <Filelist {...props} />;
      default:
        return next();
    }
  };

  return {
    schema,
    renderNode,
  };
};
