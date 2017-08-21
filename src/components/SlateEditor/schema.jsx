/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Block } from 'slate';
import merge from 'lodash/merge';
import SlateFigure from './SlateFigure';
import SlateAside from './aside/SlateAside';
import SlateLink from './SlateLink';

export const defaultBlock = {
  type: 'paragraph',
  isVoid: false,
  data: {},
};

export const getSchemaEmbedTag = (node) => ({
  caption: node.get('data').get('caption'),
  alt: node.get('data').get('alt'),
  id: node.get('data').get('id'),
  resource: node.get('data').get('resource'),
  contentLinkText: node.get('data').get('contentLinkText')
});

/* eslint-disable react/prop-types */
const topicArticleItems = {
  nodes: {
    embed: props => <SlateFigure deletedOnSave {...props} />,
  },
};

const learningResourceItems = {
  nodes: {
    embed: SlateFigure,
  },
};

const defaultSchema = {
  nodes: {
    section: props =>
      <section {...props.attributes}>
        {props.children}
      </section>,
    aside: SlateAside,
    paragraph: props =>
      <p className="c-block__paragraph" {...props.attributes}>
        {props.children}
      </p>,
    'paragraph-left': props =>
      <p
        className="c-block__paragraph"
        style={{ textAlign: 'left' }}
        {...props.attributes}>
        {props.children}
      </p>,
    'paragraph-center': props =>
      <p
        className="c-block__paragraph"
        style={{ textAlign: 'center' }}
        {...props.attributes}>
        {props.children}
      </p>,
    'paragraph-right': props =>
      <p
        className="c-block__paragraph"
        style={{ textAlign: 'right' }}
        {...props.attributes}>
        {props.children}
      </p>,
    'paragraph-justify': props =>
      <p
        className="c-block__paragraph"
        style={{ textAlign: 'justify' }}
        {...props.attributes}>
        {props.children}
      </p>,
    'bulleted-list': props =>
      <ul className="c-block__bulleted-list" {...props.attributes}>
        {props.children}
      </ul>,
    code: props =>
      <pre>
        <code {...props.attributes}>
          {props.children}
        </code>
      </pre>,
    'heading-one': props =>
      <h1 {...props.attributes}>
        {props.children}
      </h1>,
    'heading-two': props =>
      <h2 {...props.attributes}>
        {props.children}
      </h2>,
    'heading-three': props =>
      <h3 {...props.attributes}>
        {props.children}
      </h3>,
    'heading-four': props =>
      <h4 {...props.attributes}>
        {props.children}
      </h4>,
    'heading-five': props =>
      <h5 {...props.attributes}>
        {props.children}
      </h5>,
    'heading-six': props =>
      <h6 {...props.attributes}>
        {props.children}
      </h6>,
    'list-item': props =>
      <li className="c-block__list-item" {...props.attributes}>
        {props.children}
      </li>,
    'numbered-list': props =>
      <ol {...props.attributes}>
        {props.children}
      </ol>,
    quote: props =>
      <blockquote {...props.attributes}>
        {props.children}
      </blockquote>,
    link: SlateLink,
    div: props =>
      <div {...props.attributes}>
        {props.children}
      </div>,
  },
  marks: {
    bold: props =>
      <strong {...props.attributes}>
        {props.children}
      </strong>,
    code: props =>
      <code {...props.attributes}>
        {props.children}
      </code>,
    italic: props =>
      <em {...props.attributes}>
        {props.children}
      </em>,
    underlined: props =>
      <u {...props.attributes}>
        {props.children}
      </u>,
    strikethrough: props =>
      <s>
        {props.children}
      </s>,
  },
  rules: [
    // Rule to insert a paragraph block if the document is empty.
    {
      match: node => node.kind === 'document',
      validate: document => (document.nodes.size ? null : true),
      normalize: (transform, document) => {
        const block = Block.create(defaultBlock);
        transform.insertNodeByKey(document.key, 0, block);
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
      normalize: (transform, document) => {
        const block = Block.create(defaultBlock);
        transform.insertNodeByKey(document.key, document.nodes.size, block);
      },
    },
    // Rule to insert a paragraph below a node with type aside if that node is the last node
    // in the document
    {
      match: node => node.kind === 'block' && node.type === 'section',
      validate: document => {
        const lastNode = document.nodes.last();
        return lastNode && lastNode.type === 'aside' ? true : null;
      },
      normalize: (transform, document) => {
        const block = Block.create(defaultBlock);
        transform.insertNodeByKey(document.key, document.nodes.size, block);
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
      normalize: (transform, node, invalidChildren) => {
        invalidChildren.forEach(child => {
          transform.removeNodeByKey(child.key);
        });
        return transform;
      },
    },
  ],
};

export const topicArticleSchema = merge(topicArticleItems, defaultSchema);
export const learningResourceSchema = merge(
  learningResourceItems,
  defaultSchema,
);
