/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import {
  reduceElementDataAttributes,
  createEmbedProps,
  reduceChildElements,
} from './embedTagHelpers';

export const BLOCK_TAGS = {
  section: 'section',
  blockquote: 'quote',
  details: 'details',
  summary: 'summary',
  pre: 'code',
  h1: 'heading-two',
  h2: 'heading-two',
  h3: 'heading-two',
  h4: 'heading-two',
  h5: 'heading-two',
  h6: 'heading-two',
  br: 'br',
};

export const TABLE_TAGS = {
  table: 'table',
  th: 'table-cell',
  tr: 'table-row',
  td: 'table-cell',
};

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underlined',
  code: 'code',
};

const ListText = ({ children }) => children;

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
const getAsideType = el => ({
  type: el.attributes.getNamedItem('data-type')
    ? el.attributes.getNamedItem('data-type').value
    : 'rightAside',
});

const setAsideTag = data => ({
  'data-type': data.get('type') || '',
});

const illegalTextUnderBlocks = ['ol', 'ul'];

/* eslint-disable consistent-return, default-case */
export const textRule = {
  deserialize(el) {
    if (
      el.nodeName.toLowerCase() === '#text' &&
      el.parentNode &&
      illegalTextUnderBlocks.includes(el.parentNode.tagName.toLowerCase())
    ) {
      return null;
    } else if (
      !el.nodeName ||
      el.nodeName.toLowerCase() !== '#text' ||
      (el.parentNode && el.parentNode.tagName.toLowerCase() !== 'section')
    ) {
      return;
    }
    return null;
  },
};
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
    } else if (el.dataset.type === 'related-content') {
      return {
        kind: 'block',
        type: 'related',
        isVoid: true,
        data: reduceChildElements(el),
      };
    }
    const childs = next(el.childNodes);
    return {
      kind: 'block',
      type: 'div',
      nodes: childs,
    };
  },
  serialize(object, children) {
    if (object.kind !== 'block') return;
    if (object.type !== 'div' && object.type !== 'bodybox') return;
    switch (object.type) {
      case 'bodybox':
        return <div className="c-bodybox">{children}</div>;
      default:
        return <div>{children}</div>;
    }
  },
};

export const paragraphRule = {
  // div handling with text in box (bodybox)
  deserialize(el, next) {
    if (el.tagName.toLowerCase() !== 'p') return;
    const parent = el.parentElement
      ? el.parentElement.tagName.toLowerCase()
      : '';

    const type = parent === 'li' ? 'list-text' : 'paragraph';

    return {
      kind: 'block',
      type,
      nodes: next(el.childNodes),
    };
  },
  serialize(object, children) {
    if (object.kind !== 'block') return;
    if (object.type !== 'paragraph' && object.type !== 'list-text') return;
    if (object.type === 'list-text') {
      return <ListText>{children}</ListText>;
    }
    return <p>{children}</p>;
  },
};

export const listItemRule = {
  // div handling with text in box (bodybox)
  deserialize(el, next) {
    if (el.tagName.toLowerCase() !== 'li') return;
    return {
      kind: 'block',
      type: 'list-item',
      nodes: next(el.childNodes),
    };
  },
  serialize(object, children) {
    if (object.kind !== 'block') return;
    if (object.type !== 'list-item') return;
    return <li>{children}</li>;
  },
};

export const unorderListRules = {
  deserialize(el, next) {
    if (el.tagName.toLowerCase() !== 'ul') return;
    const type = el.attributes.getNamedItem('data-type');
    const data = { type: type ? type.value : '' };

    if (data.type === 'two-column') {
      return {
        kind: 'block',
        type: 'two-column-list',
        nodes: next(el.childNodes),
        data,
      };
    }

    return {
      kind: 'block',
      type: 'bulleted-list',
      nodes: next(el.childNodes),
    };
  },
  serialize(object, children) {
    if (object.kind !== 'block') return;
    if (object.type !== 'two-column-list' && object.type !== 'bulleted-list') {
      return;
    }

    if (object.type === 'two-column-list') {
      return <ul data-type="two-column">{children}</ul>;
    }
    return <ul>{children}</ul>;
  },
};

export const orderListRules = {
  // div handling with text in box (bodybox)
  deserialize(el, next) {
    if (el.tagName.toLowerCase() !== 'ol') return;
    const type = el.attributes.getNamedItem('data-type');
    const data = { type: type ? type.value : '' };
    if (data.type === 'letters') {
      return {
        kind: 'block',
        type: 'letter-list',
        nodes: next(el.childNodes),
        data,
      };
    }
    return {
      kind: 'block',
      type: 'numbered-list',
      nodes: next(el.childNodes),
    };
  },
  serialize(object, children) {
    if (object.kind !== 'block') return;
    if (object.type !== 'numbered-list' && object.type !== 'letter-list')
      return;
    if (object.type === 'letter-list') {
      return <ol data-type="letters">{children}</ol>;
    }
    return <ol>{children}</ol>;
  },
};

export const footnoteRule = {
  deserialize(el) {
    if (!el.tagName.toLowerCase().startsWith('embed')) return;
    const embed = reduceElementDataAttributes(el);
    if (embed.resource !== 'footnote') return;

    return {
      kind: 'inline',
      type: 'footnote',
      nodes: [
        {
          kind: 'text',
          isVoid: true,
          leaves: [
            {
              kind: 'leaf',
              text: '#',
              marks: [],
            },
          ],
        },
      ],
      data: {
        ...embed,
        authors: embed.authors ? embed.authors.split(';') : [],
      },
    };
  },
  serialize(object) {
    if (object.kind !== 'inline') return;
    if (object.type !== 'footnote') return;

    const data = object.data.toJS();
    const props = createEmbedProps({
      ...data,
      authors: data.authors ? data.authors.join(';') : '',
    });
    return <embed {...props} />;
  },
};

export const blockRules = {
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
        return <section>{children}</section>;
      case 'bulleted-list':
        return <ul>{children}</ul>;
      case 'heading-one':
        return <h1>{children}</h1>;
      case 'heading-two':
        return <h2>{children}</h2>;
      case 'heading-three':
        return <h3>{children}</h3>;
      case 'heading-four':
        return <h4>{children}</h4>;
      case 'heading-five':
        return <h5>{children}</h5>;
      case 'heading-six':
        return <h6>{children}</h6>;
      case 'quote':
        return <blockquote>{children}</blockquote>;
      case 'details':
        return <details>{children}</details>;
      case 'summary':
        return <summary>{children}</summary>;
      case 'br':
        return <br />;
    }
  },
};

export const tableRules = {
  deserialize(el, next) {
    const tableTag = TABLE_TAGS[el.tagName.toLowerCase()];
    if (!tableTag) return;
    return {
      kind: 'block',
      type: tableTag,
      nodes: next(el.childNodes),
    };
  },
  serialize(object, children) {
    if (object.kind !== 'block') return;
    switch (object.type) {
      case 'table': {
        return (
          <table>
            <thead>{children.slice(0, 1)}</thead>
            <tbody>{children.slice(1)}</tbody>
          </table>
        );
      }
      case 'table-row':
        return <tr>{children}</tr>;
      case 'table-cell':
        if (object.data.get('isHeader')) {
          return <th>{children}</th>;
        }
        return <td>{children}</td>;
    }
  },
};

const relatedRule = {
  serialize(object) {
    if (object.type === 'related') {
      return (
        <div data-type="related-content">
          {object.data.get('nodes') &&
            object.data
              .get('nodes')
              .map(node => <embed {...createEmbedProps(node)} />)}
        </div>
      );
    }
  },
};

const RULES = [
  divRule,
  textRule,
  orderListRules,
  unorderListRules,
  tableRules,
  paragraphRule,
  listItemRule,
  relatedRule,
  {
    // Aside handling
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'aside') return;
      return {
        kind: 'block',
        type: 'aside',
        nodes: next(el.childNodes),
        data: getAsideType(el),
      };
    },
    serialize(object, children) {
      if (object.kind !== 'block') return;
      if (object.type !== 'aside') return;
      return <aside {...setAsideTag(object.data)}>{children}</aside>;
    },
  },
  blockRules,
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
          return <strong>{children}</strong>;
        case 'italic':
          return <em>{children}</em>;
        case 'underlined':
          return <u>{children}</u>;
        case 'superscripted':
          return <sup>{children}</sup>;
      }
    },
  },
  footnoteRule,
  {
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'a') return;
      return {
        kind: 'inline',
        type: 'link',
        data: {
          href: el.href ? el.href : '#',
          target: el.target ? el.target : '',
          rel: el.rel ? el.rel : '',
        },
        nodes: next(el.childNodes),
      };
    },
    serialize(object, children) {
      if (object.kind !== 'inline') return;
      if (object.type !== 'link') return;
      const data = object.data.toJS();

      if (data.resource === 'content-link') {
        return (
          <embed
            data-resource={data.resource}
            data-content-id={data['content-id']}
            data-link-text={object.text}
            data-open-in={data['open-in']}
          />
        );
      }

      return (
        <a
          href={data.href}
          target={data.target}
          rel={data.rel}
          title={object.text}>
          {children}
        </a>
      );
    },
  },
];

const topicArticeEmbedRule = [
  {
    // Embeds handling
    deserialize(el) {
      if (el.tagName.toLowerCase() !== 'embed') return;

      if (el.dateset['data-resource'] === 'related-content') {
        return;
      }
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
      if (el.dataset['data-resource'] === 'related-content') return;
      if (embed.resource === 'content-link') {
        return {
          kind: 'inline',
          type: 'link',
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
      const props = createEmbedProps(data);

      return <embed {...props} />;
    },
  },
];

export const topicArticeRules = topicArticeEmbedRule.concat(RULES);
export const learningResourceRules = RULES.concat(learningResourceEmbedRule);
