/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import React from 'react';
import { Block } from 'slate';
import SlateTable from './SlateTable';
import defaultBlocks from '../../utils/defaultBlocks';

function normalizeNode(node, editor, next) {
  if (node.object !== 'block') return next();
  if (node.type !== 'table') return next();
  if (node.nodes.first().type !== 'table-row') return next();

  const { nodes } = node;
  const firstNode = nodes.first();
  const headerNodes = firstNode.nodes.filter(
    child => !!child.data.get('isHeader'),
  );

  if (headerNodes.size !== firstNode.nodes.size) {
    return () =>
      editor.withoutSaving(() => {
        firstNode.nodes.forEach(child =>
          editor.setNodeByKey(child.key, {
            data: { ...child.data.toJS(), isHeader: true },
          }),
        );
      });
  }
  const countCells = row =>
    row.nodes
      .map(node => {
        if (node.type === 'table-cell') {
          return node.data.get('colSpan')
            ? parseInt(node.data.get('colSpan'))
            : 1;
        }
        return 0;
      })
      .reduce((a, b) => a + b);
  const rows = nodes.filter(node => node.type === 'table-row');
  const maxCols = rows.map(countCells).max();
  const rowsMissingCols = rows.filter(row => countCells(row) < maxCols);
  const missingCells = new Map();
  if (rowsMissingCols) {
    rowsMissingCols.forEach(row => {
      let cellCount = row.nodes
        .map(node =>
          node.data.get('colSpan') ? parseInt(node.data.get('colSpan')) : 1,
        )
        .reduce((a, b) => a + b);
      for (let i = rows.indexOf(row) - 1; i > 0; i--) {
        const rowSpan = rows
          .get(i)
          .nodes.map(node => node.data.get('rowSpan'))
          .filter(val => val > rows.indexOf(row) - 1);
        cellCount += rowSpan.size;
      }
      if (cellCount < maxCols) {
        missingCells.set(row.key, maxCols - cellCount);
      }
    });
  }
  if (missingCells.size > 0) {
    return () =>
      editor.withoutSaving(() =>
        rowsMissingCols.forEach(row =>
          Array.from({ length: missingCells.get(row.key) })
            .map(() =>
              Block.create({
                type: 'table-cell',
                nodes: [Block.create(defaultBlocks.defaultBlock)],
              }),
            )
            .forEach(cell =>
              editor.insertNodeByKey(row.key, row.nodes.size, cell),
            ),
        ),
      );
  }
  return;
}

const schema = {
  blocks: {
    table: {
      next: [
        {
          type: 'paragraph',
        },
        { type: 'heading-two' },
        { type: 'heading-three' },
      ],
      normalize: (editor, error) => {
        switch (error.code) {
          case 'next_sibling_type_invalid': {
            editor.withoutSaving(() => {
              editor.wrapBlockByKey(error.child.key, 'section');
              const wrapper = editor.value.document.getParent(error.child.key);
              editor.insertNodeByKey(
                wrapper.key,
                1,
                Block.create(defaultBlocks.defaultBlock),
              );
              editor.unwrapBlockByKey(wrapper.key, 'section');
            });
            break;
          }
          default:
            break;
        }
      },
    },
  },
};

/* eslint-disable react/prop-types */
const renderBlock = (props, editor, next) => {
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
          rowSpan={node.data.get('rowSpan')}
          colSpan={node.data.get('colSpan')}
          {...attributes}>
          {children}
        </td>
      );
    default:
      return next();
  }
};

export { schema, normalizeNode, renderBlock };
