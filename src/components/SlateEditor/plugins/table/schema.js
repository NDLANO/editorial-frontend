/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import React from 'react';
import SlateTable from './SlateTable';

function validateNode(node) {
  if (node.kind !== 'block') return null;
  if (node.type !== 'table') return null;
  if (node.nodes.first().type !== 'table-row') return null;

  const { nodes } = node;
  const firstNode = nodes.first();
  const headerNodes = firstNode.nodes.filter(
    child => !!child.data.get('isHeader'),
  );

  if (headerNodes.size > 0) {
    return null;
  }

  return change => {
    firstNode.nodes.forEach(child =>
      change.setNodeByKey(child.key, {
        data: { ...child.data, isHeader: true },
      }),
    );
  };
}

const schema = {
  document: {},
};

/* eslint-disable react/prop-types */
const renderNode = props => {
  const { attributes, children, node } = props;
  switch (node.type) {
    case 'table':
      return <SlateTable {...props} />;
    case 'table-row':
      return <tr {...attributes}>{children}</tr>;
    case 'table-cell':
      return <td {...attributes}>{children}</td>;
    default:
      return null;
  }
};

export { schema, validateNode, renderNode };
