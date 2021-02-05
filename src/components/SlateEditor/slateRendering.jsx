/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import React from 'react';

export const renderBlock = (props, editor, next) => {
  const { attributes, children, node } = props;
  const { data, type } = node;
  const start = data.get('start');
  switch (type) {
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
      return <ol className={start ? `ol-reset-${start}` : ''}>{children}</ol>;
    case 'letter-list':
      return <ol className={`ol-list--roman ${start ? `ol-reset-${start}` : ''}`}>{children}</ol>;
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'div':
      return <div {...attributes}>{children}</div>;
    default:
      return next();
  }
};

export const renderInline = (props, editor, next) => {
  const { attributes, children, node } = props;
  switch (node.type) {
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
    case 'sup':
      return <sup>{children}</sup>;
    case 'sub':
      return <sub>{children}</sub>;
    case 'code':
      return (
        <code className="c-inline__code" {...attributes}>
          {children}
        </code>
      );
    default:
      return next();
  }
};
