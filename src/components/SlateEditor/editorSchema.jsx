/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import React from 'react';
import { textBlockValidationRules } from './utils';

export const getSchemaEmbed = node => node.get('data').toJS();

export const schema = {
  document: {
    nodes: [
      {
        match: [{ type: 'section' }],
        min: 1,
      },
      {
        match: [
          { type: 'paragraph' },
          { type: 'image' },
          { type: 'br' },
          { type: 'bulleted-list' },
          { type: 'numbered-list' },
          { type: 'letter-list' },
          { type: 'two-column-list' },
          { type: 'list-text' },
          { type: 'list-item' },
          { type: 'quote' },
          { type: 'div' },
          { type: 'span' },
        ],
      },
    ],
  },
  blocks: {
    section: textBlockValidationRules,
  },
};

/* eslint-disable react/prop-types */
export const renderNode = (props, editor, next) => {
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
      return next();
  }
};

export const renderMark = (props, editor, next) => {
  const { attributes, children, mark } = props;
  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>;
    case 'italic':
      return <em {...attributes}>{children}</em>;
    case 'underlined':
      return <u {...attributes}>{children}</u>;
    default:
      return next();
  }
};
