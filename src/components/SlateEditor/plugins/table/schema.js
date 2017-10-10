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

/* eslint-disable react/prop-types */
const tableSchema = {
  nodes: {
    table: SlateTable,
    'table-row': props => <tr {...props.attributes}>{props.children}</tr>,
    'table-cell': props => <td {...props.attributes}>{props.children}</td>,
  },
  rules: [
    {
      match: object => object.kind === 'block' && object.type === 'table',
      validate: node => {
        const firstNode = node.nodes.first();
        if (firstNode.type === 'table-row') {
          const isHeader = firstNode.nodes.every(
            child => !!child.data.get('isHeader'),
          );
          if (isHeader) {
            return null;
          }
        }
        return firstNode && firstNode.nodes && firstNode.type === 'table-row'
          ? firstNode.nodes
          : null;
      },
      normalize: (change, node, invalidChildren) => {
        invalidChildren.forEach(child => {
          change.setNodeByKey(child.key, {
            data: { ...child.data, isHeader: true },
          });
        });
        return change;
      },
    },
  ],
};

export default tableSchema;
