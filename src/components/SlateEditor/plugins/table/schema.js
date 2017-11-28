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

  const { nodes } = node;

  if (nodes.first().type === 'table-row') {
    const isHeader = nodes
      .first()
      .nodes.every(child => !!child.data.get('isHeader'));
    if (isHeader) {
      return null;
    }
  }

  return change => {
    nodes.forEach(child => {
      change.setNodeByKey(child.key, {
        data: { ...child.data, isHeader: true },
      });
    });
  };
}

const schema = {
  document: {
    nodes: [
      { types: ['table'] },
      { types: ['table-row'] },
      { types: ['table-cell'] },
    ],
  },
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

export { validateNode, schema, renderNode };
