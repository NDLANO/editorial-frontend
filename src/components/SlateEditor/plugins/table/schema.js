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

function normalizeNode(node, editor, next) {
  if (node.object !== 'block') return next();
  if (node.type !== 'table') return next();
  if (node.nodes.first().type !== 'table-row') return next();

  const { nodes } = node;
  const firstNode = nodes.first();
  const headerNodes = firstNode.nodes.filter(
    child => !!child.data.get('isHeader'),
  );

  if (headerNodes.size > 0) {
    return next();
  }

  return () =>
    editor.withoutSaving(() => {
      firstNode.nodes.forEach(child =>
        editor.setNodeByKey(child.key, {
          data: { ...child.data, isHeader: true },
        }),
      );
    });
}

const schema = {
  document: {},
};

/* eslint-disable react/prop-types */
const renderNode = (props, editor, next) => {
  const { attributes, children, node } = props;
  switch (node.type) {
    case 'table':
      return <SlateTable {...props} />;
    case 'table-row':
      return <tr {...attributes}>{children}</tr>;
    case 'table-cell':
      return (
        <td
          className={node.data.get('isHeader') ? 'c-table__header' : ''}
          {...attributes}>
          {children}
        </td>
      );
    default:
      return next();
  }
};

export { schema, normalizeNode, renderNode };
