/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
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
};

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underlined',
  code: 'code',
};

export const findNodesByType = (node, type, nodes = []) => {
  if (node.type === type) {
    nodes.push(node);
  } else if (
    node.kind === 'document' ||
    (node.kind === 'block' && node.nodes.size > 0)
  ) {
    node.nodes.forEach(n => findNodesByType(n, type, nodes));
  }
  return nodes;
};

export const toJSON = state => state.toJSON();

export const logState = state => {
  console.log(JSON.stringify(toJSON(state), null, 2)); // eslint-disable-line no-console
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

export const divRule = {
  // div handling with text in box (bodybox)
  deserialize(el, next) {
    if (el.tagName.toLowerCase() !== 'div') return;
    if (el.className === 'c-bodybox') {
      return {
        kind: 'block',
        type: 'bodybox',
        nodes: next(el.childNodes),
      };
    }
    return {
      kind: 'block',
      type: 'div',
      nodes: next(el.childNodes),
    };
  },
  serialize(object, children) {
    if (object.kind !== 'block') return;
    if (object.type !== 'div' && object.type !== 'bodybox') return;
    switch (object.type) {
      case 'bodybox':
        return (
          <div className="c-bodybox">
            {children}
          </div>
        );
      default:
        return (
          <div>
            {children}
          </div>
        );
    }
  },
};

export const createFootnoteRule = (footnotesData, footnoteCounter) => {
  const createFootnoteData = (el, data) => {
    const footnoteKey = el.attributes
      .getNamedItem('name')
      .value.replace(/_sup/g, '');

    return data[footnoteKey];
  };

  return {
    deserialize(el) {
      if (el.tagName.toLowerCase() !== 'a') return;
      if (el.name && el.name.match(/ref_\d+_sup/)) {
        return {
          kind: 'inline',
          type: 'footnote',
          nodes: [
            {
              kind: 'text',
              text: '#',
              isVoid: true,
            },
          ],
          data: {
            ...createFootnoteData(el, footnotesData),
          },
        };
      }
    },
    serialize(object) {
      if (object.kind !== 'inline') return;
      if (object.type !== 'footnote') return;
      const count = footnoteCounter.getNextCount();
      const name = `ref_${count}_sup`;
      const markup = (
        <a href={`#ref_${count}_cite`} name={name}>
          <sup>
            {count}
          </sup>
        </a>
      );
      return markup;
    },
  };
};

function createRules(contentData = {}, footnoteCounter) {
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
        return <deleteme />;
      },
    },
    divRule,
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
          case 'superscripted':
            return (
              <sup>
                {children}
              </sup>
            );
        }
      },
    },
    createFootnoteRule(contentData.footnotes, footnoteCounter),
    {
      deserialize(el, next) {
        if (el.tagName.toLowerCase() !== 'a') return;
        if (el.name || el.name.match(/ref_\d+_sup/)) return; // is footnote
        return {
          kind: 'inline',
          type: 'link',
          data: { href: el.href ? el.href : '#' },
          nodes: next(el.childNodes),
        };
      },
      serialize(object, children) {
        if (object.kind !== 'inline') return;
        if (object.type !== 'link') return;
        const href = object.data.href;
        return (
          <a href={href}>
            {children}
          </a>
        );
      },
    },
  ];
  return RULES;
}

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

export const topicArticeRules = topicArticeEmbedRule.concat(createRules());
export function learningResourceRules(contentData, footnoteCounter) {
  return learningResourceEmbedRule.concat(
    createRules(contentData, footnoteCounter),
  );
}
