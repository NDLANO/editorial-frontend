/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import NoEmbedMessage from './NoEmbedMessage';

export default function createNoEmbedsPlugin() {
  const schema = {
    document: {},
  };

  /* eslint-disable react/prop-types */
  const renderNode = props => {
    const { node } = props;
    switch (node.type) {
      case 'embed':
        return <NoEmbedMessage {...props} />;
      default:
        return null;
    }
  };

  return {
    schema,
    renderNode,
  };
}
