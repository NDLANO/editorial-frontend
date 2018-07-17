/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import EditConcept from './EditConcept';

export const TYPE = 'concept';

export default function linkPlugin() {
  const schema = {
    document: {},
  };

  /* eslint-disable react/prop-types */
  const renderNode = props => {
    const { node, editor, attributes } = props;
    const { value } = editor.props;

    switch (node.type) {
      case TYPE:
        return <EditConcept {...{ attributes, value, editor, node }} />;
      default:
        return null;
    }
  };

  return {
    schema,
    renderNode,
  };
}
