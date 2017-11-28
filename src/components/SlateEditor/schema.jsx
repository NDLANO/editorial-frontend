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

export const defaultAsideBlock = type =>
  Block.create({
    data: { type },
    isVoid: false,
    type: 'aside',
    nodes: Block.createList([defaultBlock]),
  });

export const defaultEmbedBlock = data =>
  Block.create({
    data,
    isVoid: true,
    type: 'embed',
  });

export const getSchemaEmbed = node => node.get('data').toJS();

export const schema = {
  document: {},
};

export const defaultRules = [
  // Rule to insert a paragraph below a aside/bodybox if that node is
  // the last one in the aside.
  {
    match: node => node.kind === 'block' && node.type === 'aside',
    validate: node => {
      if (!node.nodes.size) {
        return true;
      }
      const lastNode = node.nodes.last();
      return lastNode &&
        (lastNode.type === 'aside' || lastNode.type === 'bodybox')
        ? true
        : null;
    },
    normalize: (change, document) => {
      const block = Block.create(defaultBlock);
      return change.insertNodeByKey(document.key, document.nodes.size, block);
    },
  },
  {
    match: node => node.kind === 'block' && node.type === 'section',
    validate: node => {
      if (!node.nodes.size) {
        return true;
      }
      const lastNode = node.nodes.last();
      return lastNode && lastNode.type === 'table' ? true : null;
    },
    normalize: (change, document) => {
      const block = Block.create(defaultBlock);
      return change.insertNodeByKey(document.key, document.nodes.size, block);
    },
  },
  // Rule to insert a paragraph below a void node (the image) if that node is
  // the last one in the aside/bodybox.
  {
    match: node =>
      node.kind === 'block' &&
      (node.type === 'aside' || node.type === 'bodybox'),
    validate: node => {
      const lastNode = node.nodes.last();
      return lastNode && lastNode.type === 'embed' ? true : null;
    },
    normalize: (change, document) => {
      const block = Block.create(defaultBlock);
      return change.insertNodeByKey(document.key, document.nodes.size, block);
    },
  },
  // Rule to insert a paragraph block if the document is empty.
  {
    match: node => node.kind === 'document',
    validate: document => (document.nodes.size ? null : true),
    normalize: (change, document) => {
      const block = Block.create(defaultBlock);
      return change.insertNodeByKey(document.key, 0, block);
    },
  },
  // Rule to insert a paragraph below a void node (the image) if that node is
  // the last one in the document.
  {
    match: node => node.kind === 'block',
    validate: document => {
      const lastNode = document.nodes.last();
      return lastNode && lastNode.isVoid ? true : null;
    },
    normalize: (change, document) => {
      const block = Block.create(defaultBlock);
      return change.insertNodeByKey(document.key, document.nodes.size, block);
    },
  },
  // Rule to insert a paragraph below a node with type aside if that node is the last node
  // in the document
  {
    match: node =>
      node.kind === 'block' && (node.type === 'section' || node.type === 'div'),
    validate: document => {
      const lastNode = document.nodes.last();
      return lastNode &&
        (lastNode.type === 'aside' || lastNode.type === 'bodybox')
        ? true
        : null;
    },
    normalize: (change, document) => {
      const block = Block.create(defaultBlock);
      return change.insertNodeByKey(document.key, document.nodes.size, block);
    },
  },
  // Rule to remove all empty text nodes that exists in the document
  {
    match: node => node.kind === 'block',
    validate: node => {
      const invalidChildren = node.nodes.filter(
        child => child.kind === 'block' && child.type === 'emptyTextNode',
      );
      return invalidChildren.size ? invalidChildren : null;
    },
    normalize: (change, node, invalidChildren) => {
      invalidChildren.forEach(child => {
        change.removeNodeByKey(child.key);
      });
      return change;
    },
    render: '',
  },
];

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
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'div':
      return <div {...attributes}>{children}</div>;
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
