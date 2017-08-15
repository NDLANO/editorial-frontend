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

const defaultBlock = {
  type: 'paragraph',
  isVoid: false,
  data: {},
};

/* eslint-disable react/prop-types */
const topicArticleItems = {
  nodes: {
    embed: <SlateFigure deletedOnSave />,
  },
};

const learningResourceItems = {
  nodes: {
    embed: <SlateFigure />,
  },
};

const defaultSchema = {
  nodes: {
    section: props =>
      <section {...props.attributes}>
        {props.children}
      </section>,
    paragraph: props =>
      <p className="c-block__paragraph" {...props.attributes}>
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
    link: props => {
      const { data } = props.node;
      const href = data.get('href');
      return (
        <a href={href} {...props.attributes}>
          {props.children}
        </a>
      );
    },
  },
  marks: {
    bold: props =>
      <strong>
        {props.children}
      </strong>,
    code: props =>
      <code>
        {props.children}
      </code>,
    italic: props =>
      <em>
        {props.children}
      </em>,
    underlined: props =>
      <u>
        {props.children}
      </u>,
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
      match: node => node.kind === 'document',
      validate: document => {
        const lastNode = document.nodes.last();
        return lastNode && lastNode.isVoid ? true : null;
      },
      normalize: (transform, document) => {
        const block = Block.create(defaultBlock);
        transform.insertNodeByKey(document.key, document.nodes.size, block);
      },
    },
  ],
};

export const topicArticleSchema = merge(topicArticleItems, defaultSchema);
export const learningResourceSchema = merge(
  learningResourceItems,
  defaultSchema,
);
