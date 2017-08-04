import React from 'react';

/* eslint-disable react/prop-types */

export const schema = {
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
      <ul style={{ margin: '16px 0', padding: 0 }} {...props.attributes}>
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
      <li
        style={{
          lineHeight: '1.7em',
          marginBottom: '13px',
          direction: 'ltr',
          marginLeft: '1.5em',
        }}
        {...props.attributes}>
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
};
