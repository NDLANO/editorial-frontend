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

export const defaultBlock = {
  type: 'paragraph',
  isVoid: false,
  data: {},
};

export const defaultBlockWithText = text => ({
  data: {},
  isVoid: false,
  object: 'block',
  nodes: [
    {
      object: 'text',
      leaves: [
        {
          object: 'leaf',
          marks: [],
          text,
        },
      ],
    },
  ],
  type: 'paragraph',
});

export const defaultAsideBlock = type =>
  Block.create({
    data: { type },
    isVoid: false,
    type: 'aside',
    nodes: Block.createList([defaultBlock]),
  });

export const defaultEmbedBlock = data =>
  Block.create({
    isVoid: true,
    type: 'embed',
    data,
  });

export const defaultRelatedBlock = () =>
  Block.create({
    isVoid: true,
    object: 'block',
    type: 'related',
  });

export const getSchemaEmbed = node => node.get('data').toJS();

export const schema = {
  document: {},
};

export function validateNode(node) {
  // Document rules
  if (node.object === 'document') {
    // Rule to insert a paragraph block if the document is empty.
    if (!node.nodes.size) {
      const block = Block.create(defaultBlock);
      return change => change.insertNodeByKey(node.key, 0, block);
    }
  }

  // Block rules
  if (node.object === 'block') {
    // Type-specific rules
    switch (node.type) {
      // Rule to always add a paragrah node if end of a section
      case 'section': {
        const lastNode = node.nodes.last();
        if (lastNode.type !== 'paragraph') {
          const block = Block.create(defaultBlock);
          return change =>
            change.insertNodeByKey(node.key, node.nodes.size, block);
        }
        break;
      }
      default:
        break;
    }

    // Rule to remove all empty text nodes that exists in the document
    const invalidChildren = node.nodes.filter(
      child =>
        child.object === 'block' &&
        (child.type === 'emptyTextNode' || !child.type),
    );
    if (invalidChildren.size > 0) {
      return change => {
        invalidChildren.forEach(child => {
          change.removeNodeByKey(child.key);
        });
      };
    }
  }
  return null;
}

/* eslint-disable react/prop-types */
export const renderNode = props => {
  const { attributes, children, node } = props;
  switch (node.type) {
    case 'section':
      return <section {...attributes}>{children}</section>;
    case 'br':
      return <br {...attributes} />;
    case 'paragraph':
      return <p {...attributes}>{children}</p>;
    case 'bulleted-list':
      return (
        <ul className="c-block__bulleted-list" {...attributes}>
          {children}
        </ul>
      );
    case 'list-text':
      return <span {...attributes}>{children}</span>;
    case 'list-item':
      return (
        <li className="c-block__list-item" {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'letter-list':
      return (
        <ol className="ol-list--roman" {...attributes}>
          {children}
        </ol>
      );
    case 'two-column-list':
      return (
        <ul className="o-list--two-columns" {...attributes}>
          {children}
        </ul>
      );
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'div':
      return <div {...attributes}>{children}</div>;
    case 'span':
      return <span {...attributes}>{children}</span>;
    default:
      return null;
  }
};

export const renderMark = props => {
  const { attributes, children, mark } = props;
  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>;
    case 'italic':
      return <em {...attributes}>{children}</em>;
    case 'underlined':
      return <u {...attributes}>{children}</u>;
    default:
      return null;
  }
};
