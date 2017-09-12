/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Raw } from 'slate';
import isObject from 'lodash/fp/isObject';
import { reduceElementDataAttributes } from './embedTagHelpers';

const BLOCK_TAGS = {
  section: 'section',
  p: 'paragraph',
  li: 'list-item',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  blockquote: 'quote',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six',
  div: 'div',
};

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underlined',
  s: 'strikethrough',
  code: 'code',
};

export const findEmbedNodes = (node, embeds = []) => {
  if (node.type === 'embed') {
    embeds.push(node);
  } else if (
    node.kind === 'document' ||
    (node.kind === 'block' &&
      node.nodes.size > 0 &&
      node.nodes.first().kind === 'block')
  ) {
    node.nodes.forEach(n => findEmbedNodes(n, embeds));
  }
  return embeds;
};

export const logState = state => {
  console.log(JSON.stringify(Raw.serialize(state), null, 2)); // eslint-disable-line no-console
};

// TODO: get type of aside in here. Default should be rightAside since that is the only
const getAsideTag = el => ({
  type: el.attributes.getNamedItem('data-type')
    ? el.attributes.getNamedItem('data-type')
    : 'rightAside',
});

const setAsideTag = data => ({
  'data-type': data.get('type') || '',
});
/* eslint-disable consistent-return, default-case */

const RULES = [
  {
    // empty text nodes
    deserialize(el) {
      if (el.nodeName.toLowerCase() !== '#text') return;
      if (el.textContent.trim().length !== 0) return;
      return {
        kind: 'block',
        type: 'emptyTextNode',
        nodes: [],
      };
    },
    serialize(object) {
      if (object.kind !== 'block') return;
      if (object.type !== 'emptyTextNode') return;
      return <span />;
    },
  },
  {
    // Aside handling
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'aside') return;
      return {
        kind: 'block',
        type: 'aside',
        nodes: next(el.childNodes),
        data: getAsideTag(el),
      };
    },
    serialize(object, children) {
      if (object.kind !== 'block') return;
      if (object.type !== 'aside') return;
      return (
        <aside {...setAsideTag(object.data)}>
          {children}
        </aside>
      );
    },
  },
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (!block) return;
      return {
        kind: 'block',
        type: block,
        nodes: next(el.childNodes),
      };
    },
    serialize(object, children) {
      if (object.kind !== 'block') return;
      switch (object.type) {
        case 'section':
          return (
            <section>
              {children}
            </section>
          );
        case 'paragraph-left':
          return (
            <p style={{ textAlign: 'left' }}>
              {children}
            </p>
          );
        case 'paragraph-center':
          return (
            <p style={{ textAlign: 'center' }}>
              {children}
            </p>
          );
        case 'paragraph-right':
          return (
            <p style={{ textAlign: 'right' }}>
              {children}
            </p>
          );
        case 'paragraph-justify':
          return (
            <p style={{ textAlign: 'justify' }}>
              {children}
            </p>
          );
        case 'paragraph':
          return (
            <p>
              {children}
            </p>
          );
        case 'bulleted-list':
          return (
            <ul>
              {children}
            </ul>
          );
        case 'heading-one':
          return (
            <h1>
              {children}
            </h1>
          );
        case 'heading-two':
          return (
            <h2>
              {children}
            </h2>
          );
        case 'heading-three':
          return (
            <h3>
              {children}
            </h3>
          );
        case 'heading-four':
          return (
            <h4>
              {children}
            </h4>
          );
        case 'heading-five':
          return (
            <h5>
              {children}
            </h5>
          );
        case 'heading-six':
          return (
            <h6>
              {children}
            </h6>
          );
        case 'list-item':
          return (
            <li>
              {children}
            </li>
          );
        case 'numbered-list':
          return (
            <ol>
              {children}
            </ol>
          );
        case 'quote':
          return (
            <blockquote>
              {children}
            </blockquote>
          );
        case 'div':
          return (
            <div>
              {children}
            </div>
          );
      }
    },
  },
  {
    deserialize(el, next) {
      const mark = MARK_TAGS[el.tagName.toLowerCase()];
      if (!mark) return;
      return {
        kind: 'mark',
        type: mark,
        nodes: next(el.childNodes),
      };
    },
    serialize(object, children) {
      if (object.kind !== 'mark') return;
      switch (object.type) {
        case 'bold':
          return (
            <strong>
              {children}
            </strong>
          );
        case 'italic':
          return (
            <em>
              {children}
            </em>
          );
        case 'underlined':
          return (
            <u>
              {children}
            </u>
          );
        case 'strikethrough':
          return (
            <s>
              {children}
            </s>
          );
      }
    },
  },
  {
    // Special case for links, to grab their href.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'a') return;
      return {
        kind: 'inline',
        type: 'link',
        data: { href: el.href ? el.href : '#' },
        nodes: next(el.childNodes),
      };
    },
    serialize(object, children) {
      if (object.kind !== 'inline') return;
      const href = object.data.href;
      switch (object.type) {
        case 'link':
          return (
            <a href={href}>
              {children}
            </a>
          );
      }
    },
  },
];

const topicArticeEmbedRule = [
  {
    // Embeds handling
    deserialize(el) {
      if (el.tagName.toLowerCase() !== 'embed') return;
      return {
        kind: 'block',
        type: 'embed',
        data: reduceElementDataAttributes(el),
        isVoid: true,
      };
    },
    serialize(object) {
      if (object.kind !== 'block') return;
      if (object.type !== 'embed') return;
      switch (object.type) {
        case 'embed':
          return <deleteme />;
      }
    },
  },
];

export const learningResourceEmbedRule = [
  {
    deserialize(el) {
      if (!el.tagName.toLowerCase().startsWith('embed')) return;
      const embed = reduceElementDataAttributes(el);
      if (embed.resource === 'content-link') {
        return {
          kind: 'inline',
          type: 'embed-inline',
          data: embed,
          nodes: [
            {
              kind: 'text',
              text: embed['link-text']
                ? embed['link-text']
                : 'Ukjent link tekst',
            },
          ],
          isVoid: false,
        };
      }
      return {
        kind: 'block',
        type: 'embed',
        data: embed,
        isVoid: true,
      };
    },
    serialize(object) {
      if (!object.type || !object.type.startsWith('embed')) return;

      const data = object.data.toJS();
      const props = Object.keys(data)
        .filter(key => data[key] !== undefined && !isObject(data[key]))
        .reduce((acc, key) => ({ ...acc, [`data-${key}`]: data[key] }), {});
      return <embed {...props} />;
    },
  },
];

export const topicArticeRules = topicArticeEmbedRule.concat(RULES);
export const learningResourceRules = learningResourceEmbedRule.concat(RULES);
