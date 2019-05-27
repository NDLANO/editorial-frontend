/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import isEmpty from 'lodash/fp/isEmpty';
import { uuid } from '@ndla/util';
import {
  reduceElementDataAttributes,
  createDataProps,
  createProps,
  reduceChildElements,
  removeEmptyElementDataAttributes,
} from './embedTagHelpers';

const BLOCK_TAGS = {
  section: 'section',
  blockquote: 'quote',
  pre: 'pre',
  h1: 'heading-two',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-three',
  h5: 'heading-three',
  h6: 'heading-three',
  summary: 'summary',
  details: 'details',
};

export const INLINE_TAGS = {
  span: 'span',
};

export const TABLE_TAGS = {
  table: 'table',
  th: 'table-cell',
  tr: 'table-row',
  td: 'table-cell',
};

export const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underlined',
  code: 'code',
  sup: 'superscripted',
};

const ListText = ({ children }) => children;

const emptyNodes = [
  {
    object: 'text',
    leaves: [
      {
        object: 'leaf',
        marks: [],
        text: '',
      },
    ],
  },
];

export const findNodesByType = (node, type, nodes = []) => {
  if (node.type === type) {
    nodes.push(node);
  } else if (
    node.object === 'document' ||
    (node.object === 'block' && node.nodes.size > 0)
  ) {
    node.nodes.forEach(n => findNodesByType(n, type, nodes));
  }
  return nodes;
};

export const toJSON = state => state.toJSON();

export const logState = state => {
  console.log(JSON.stringify(toJSON(state), null, 2)); // eslint-disable-line no-console
};

// Check if a the parent element can contain a Slate block. This is useful because Slate does not
// allow you to have mixed inline and block level content in the same node. A block can either
// contain all block nodes, or it can contain inline and text nodes.
const canParentElementContainBlock = el => {
  if (el.parentNode && el.parentNode.tagName) {
    const tagName = el.parentNode.tagName.toLowerCase();
    return (
      tagName === 'section' ||
      tagName === 'div' ||
      tagName === 'aside' ||
      BLOCK_TAGS[tagName] !== undefined
    );
  }
  return false;
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
    }
    if (
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
  // div handling with text in box (bodybox), related content and file embeds
  deserialize(el, next) {
    if (el.tagName.toLowerCase() !== 'div') return;
    const { type } = el.dataset;

    if (el.className === 'c-bodybox') {
      return {
        object: 'block',
        type: 'bodybox',
        nodes: next(el.childNodes),
      };
    }
    if (type === 'related-content') {
      return {
        object: 'block',
        type: 'related',
        data: reduceChildElements(el, type),
        nodes: emptyNodes,
      };
    }
    if (type === 'file') {
      return {
        object: 'block',
        type: 'file',
        nodes: emptyNodes,
        data: reduceChildElements(el, type),
      };
    }
    const childs = next(el.childNodes);
    return {
      object: 'block',
      type: 'div',
      nodes: childs,
    };
  },
  serialize(slateObject, children) {
    if (slateObject.object !== 'block') return;
    if (
      slateObject.type !== 'div' &&
      slateObject.type !== 'bodybox' &&
      slateObject.type !== 'file'
    )
      return;
    switch (slateObject.type) {
      case 'bodybox':
        return <div className="c-bodybox">{children}</div>;
      case 'file':
        return (
          <div data-type="file">
            {slateObject.data.get('nodes') &&
              slateObject.data
                .get('nodes')
                .map(node => <embed {...createDataProps(node)} />)}
          </div>
        );
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
      object: 'block',
      data: {
        ...reduceElementDataAttributes(el),
      },
      type,
      nodes: next(el.childNodes),
    };
  },
  serialize(slateObject, children) {
    if (slateObject.object !== 'block') return;
    if (slateObject.type !== 'paragraph' && slateObject.type !== 'list-text')
      return;
    if (slateObject.type === 'list-text') {
      return <ListText>{children}</ListText>;
    }

    /**
      We insert empty p tag throughout the document to enable positioning the cursor
      between element with no spacing (i.e two images). We need to remove these element
      on seriaization.
     */
    if (slateObject.text === '') return null;

    const dataProps = createDataProps(slateObject.data.toJS());
    return <p {...dataProps}>{children}</p>;
  },
};

export const listItemRule = {
  // div handling with text in box (bodybox)
  deserialize(el, next) {
    if (el.tagName.toLowerCase() !== 'li') return;
    // const nodes = [...next(el.childNodes), ...emptyNodes];

    return {
      object: 'block',
      type: 'list-item',
      nodes: next(el.childNodes),
    };
  },
  serialize(slateObject, children) {
    if (slateObject.object !== 'block') return;
    if (slateObject.type !== 'list-item') return;
    return <li>{children}</li>;
  },
};

export const unorderListRules = {
  deserialize(el, next) {
    if (el.tagName.toLowerCase() !== 'ul') return;
    return {
      object: 'block',
      type: 'bulleted-list',
      nodes: next(el.childNodes),
    };
  },
  serialize(slateObject, children) {
    if (slateObject.object !== 'block') return;
    if (slateObject.type !== 'bulleted-list') {
      return;
    }
    return <ul>{children}</ul>;
  },
};

export const mathRules = {
  deserialize(el) {
    const tagName = el.tagName.toLowerCase();
    if (tagName !== 'math') return;
    return {
      object: canParentElementContainBlock(el) ? 'block' : 'inline',
      type: 'mathml',
      data: { ...reduceElementDataAttributes(el), innerHTML: el.innerHTML },
      nodes: [
        {
          object: 'text',
          leaves: [
            {
              object: 'leaf',
              text: 'm',
            },
          ],
        },
      ],
    };
  },
  serialize(slateObject) {
    const { type, data } = slateObject;
    if (type !== 'mathml') return;
    const { innerHTML, ...mathAttributes } = data.toJS();
    return (
      <math
        {...mathAttributes}
        dangerouslySetInnerHTML={{
          __html: innerHTML,
        }}
      />
    );
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
        object: 'block',
        type: 'letter-list',
        nodes: next(el.childNodes),
        data,
      };
    }
    return {
      object: 'block',
      type: 'numbered-list',
      nodes: next(el.childNodes),
    };
  },
  serialize(slateObject, children) {
    if (slateObject.object !== 'block') return;
    if (
      slateObject.type !== 'numbered-list' &&
      slateObject.type !== 'letter-list'
    )
      return;
    if (slateObject.type === 'letter-list') {
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
      object: 'inline',
      type: 'footnote',
      nodes: [
        {
          object: 'text',
          leaves: [
            {
              object: 'leaf',
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
  serialize(slateObject) {
    if (slateObject.object !== 'inline') return;
    if (slateObject.type !== 'footnote') return;

    const data = slateObject.data.toJS();
    const props = createDataProps({
      ...data,
      authors: data.authors ? data.authors.join(';') : '',
    });
    return <embed {...props} />;
  },
};

export const blockRules = {
  deserialize(el, next) {
    const block = BLOCK_TAGS[el.tagName.toLowerCase()];
    if (block) {
      return {
        object: 'block',
        type: block,
        nodes: next(el.childNodes),
      };
    }
  },
  serialize(slateObject, children) {
    if (slateObject.object !== 'block') return;
    switch (slateObject.type) {
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
      case 'pre':
        return <pre>{children}</pre>;
      case 'details':
        return <details>{children}</details>;
      case 'summary':
        return <summary>{children}</summary>;
    }
  },
};

export const inlineRules = {
  deserialize(el, next) {
    const inline = INLINE_TAGS[el.tagName.toLowerCase()];
    const attributes = reduceElementDataAttributes(el);

    if (!inline) return;
    if (inline === 'span' && isEmpty(attributes)) return; // Keep only spans with attributes

    return {
      object: 'inline',
      type: inline,
      data: attributes,
      nodes: next(el.childNodes),
    };
  },
  serialize(slateObject, children) {
    if (slateObject.object !== 'inline') return;
    const data = slateObject.data.toJS();
    const props = createProps(data);
    const inline = INLINE_TAGS[slateObject.type];
    if (inline) {
      return <slateObject.type {...props}>{children}</slateObject.type>;
    }
  },
};

export const tableRules = {
  deserialize(el, next) {
    const tagName = el.tagName.toLowerCase();
    const tableTag = TABLE_TAGS[tagName];
    if (!tableTag) return;

    const attributes = reduceElementDataAttributes(el);
    return {
      object: 'block',
      type: tableTag,
      data: { isHeader: tagName === 'th', ...attributes },
      nodes: next(el.childNodes),
    };
  },
  serialize(object, children) {
    if (object.object !== 'block') return;

    const data = object.data.toJS();
    const props = removeEmptyElementDataAttributes({
      ...createProps(data),
      isHeader: undefined,
    });
    switch (object.type) {
      case 'table': {
        return (
          <table {...props}>
            <thead>{children.slice(0, 1)}</thead>
            <tbody>{children.slice(1)}</tbody>
          </table>
        );
      }
      case 'table-row':
        return <tr {...props}>{children}</tr>;
      case 'table-cell':
        if (object.data.get('isHeader')) {
          return <th {...props}>{children}</th>;
        }
        return <td {...props}>{children}</td>;
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
              .map(node => <embed key={uuid()} {...createDataProps(node)} />)}
        </div>
      );
    }
  },
};

export const brRule = {
  deserialize(el, next) {
    if (el.tagName.toLowerCase() !== 'br') return;

    // Transform <br> in blocktags as blocks. This prevents slate from
    // wrapping br in paragraphs (i.e. "<br><br><br>" -> "<p><br><br><br></p>"
    if (canParentElementContainBlock(el)) {
      return {
        object: 'block',
        type: 'br',
        nodes: next(el.childNodes),
      };
    }
    // Default to standard slate deserializing if not in a known block
  },
  serialize(slateObject) {
    if (slateObject.type !== 'br') return;
    return <br />;
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
  mathRules,
  {
    // Aside handling
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'aside') return;
      return {
        object: 'block',
        type: 'aside',
        nodes: next(el.childNodes),
        data: getAsideType(el),
      };
    },
    serialize(slateObject, children) {
      if (slateObject.object !== 'block') return;
      if (slateObject.type !== 'aside') return;
      return <aside {...setAsideTag(slateObject.data)}>{children}</aside>;
    },
  },
  blockRules,
  inlineRules,
  brRule,
  {
    deserialize(el, next) {
      const mark = MARK_TAGS[el.tagName.toLowerCase()];
      if (!mark) return;
      if (el.childNodes[0].data === ' ') return;
      return {
        object: 'mark',
        type: mark,
        nodes: next(el.childNodes),
      };
    },
    serialize(slateObject, children) {
      if (slateObject.object !== 'mark') return;
      switch (slateObject.type) {
        case 'bold':
          return <strong>{children}</strong>;
        case 'italic':
          return <em>{children}</em>;
        case 'underlined':
          return <u>{children}</u>;
        case 'superscripted':
          return <sup>{children}</sup>;
        case 'code':
          return <code>{children}</code>;
      }
    },
  },
  footnoteRule,
  {
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'a') return;
      const nodes = next(el.childNodes);
      return {
        object: 'inline',
        type: 'link',
        data: {
          href: el.href ? el.href : '#',
          target: el.target !== '' ? el.target : undefined,
          title: el.title !== '' ? el.title : undefined,
          rel: el.rel !== '' ? el.rel : undefined,
        },
        nodes,
      };
    },
    serialize(slateObject, children) {
      if (slateObject.object !== 'inline') return;
      if (slateObject.type !== 'link') return;
      const data = slateObject.data.toJS();

      if (data.resource === 'content-link') {
        return (
          <embed
            data-content-id={data['content-id']}
            data-link-text={slateObject.text}
            data-open-in={data['open-in']}
            data-resource={data.resource}
          />
        );
      }

      return (
        <a
          href={data.href}
          rel={data.rel}
          target={data.target}
          title={data.title}>
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
      return {
        object: 'block',
        type: 'embed',
        data: reduceElementDataAttributes(el),
      };
    },
    serialize(object) {
      if (object.object !== 'block') return;
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

      if (el.dataset.resource === 'related-content') return;
      if (embed.resource === 'content-link') {
        return {
          object: 'inline',
          type: 'link',
          data: embed,
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  object: 'leaf',
                  text: embed['link-text']
                    ? embed['link-text']
                    : 'Ukjent link tekst',
                  marks: [],
                },
              ],
            },
          ],
        };
      }
      if (embed.resource === 'concept') {
        return {
          object: 'inline',
          type: 'concept',
          data: embed,
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  object: 'leaf',
                  text: embed['link-text']
                    ? embed['link-text']
                    : 'Ukjent begrepstekst',
                  marks: [],
                },
              ],
            },
          ],
        };
      }

      return {
        object: 'block',
        type: 'embed',
        data: embed,
        nodes: emptyNodes,
      };
    },

    serialize(object) {
      if (
        (object.type && object.type.startsWith('embed')) ||
        object.type === 'concept'
      ) {
        const data = object.data.toJS();
        const props = createDataProps(data);

        return <embed {...props} />;
      }
    },
  },
];

export const topicArticeRules = topicArticeEmbedRule.concat(RULES);
export const learningResourceRules = RULES.concat(learningResourceEmbedRule);
