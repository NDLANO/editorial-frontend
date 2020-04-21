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
import { Element, Text, Node } from 'slate';
import { Rule, deserializeHtml } from './serializer'

declare global { namespace JSX {
  interface IntrinsicElements {
    'math': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'deleteme': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}}

type NextFunc = (child: ChildNode) => any;

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
  sup: 'sup',
  sub: 'sub',
};

const ListText = (props: { children: any }) => props.children;

const emptyNodes = [
  {
    object: 'text',
    text: '',
    marks: [],
  },
];

export const findNodesByType = (node: Node, type: string, nodes: Node[] = []): Node[] => {
  if ((type === 'text' && Text.isText(node)) || node?.type === type) {
    nodes.push(node);
  } else if (node?.children.length > 0) {
    (node.children.foreach((n: Node) => findNodesByType(n, type, nodes)));
  }
  return nodes;
};

export const toJSON = (state: any) => state.toJSON();

export const logState = (state: any) => {
  console.log(JSON.stringify(toJSON(state), null, 2)); // eslint-disable-line no-console
};

// Check if a the parent element can contain a Slate block. This is useful because Slate does not
// allow you to have mixed inline and block level content in the same node. A block can either
// contain all block nodes, or it can contain inline and text nodes.
const canParentElementContainBlock = (el: HTMLElement) => {
  if (el.parentElement && el.parentElement.tagName) {
    const tagName = el.parentElement.tagName.toLowerCase();
    return (
      tagName === 'section' ||
      tagName === 'div' ||
      tagName === 'aside' ||
      tagName in BLOCK_TAGS
    );
  }
  return false;
};

// TODO: get type of aside in here. Default should be rightAside since that is the only
const getAsideType = (el: HTMLElement) => ({
  type: el.attributes.getNamedItem('data-type')
    ? el.attributes.getNamedItem('data-type')?.value
    : 'rightAside',
});

const setAsideTag = (data: Element) => ({
  'data-type': data.get('type') || '',
});

const illegalTextUnderBlocks = ['ol', 'ul'];

/* eslint-disable consistent-return, default-case */
export const textRule: Rule = {
  deserialize(el: HTMLElement, next: NextFunc) {
    if (
      el.nodeName.toLowerCase() === '#text' &&
      el.parentElement &&
      illegalTextUnderBlocks.includes(el.parentElement.tagName.toLowerCase())
    ) {
      return null;
    }
    if (
      !el.nodeName ||
      el.nodeName.toLowerCase() !== '#text' ||
      (el.parentElement && el.parentElement.tagName.toLowerCase() !== 'section')
    ) {
      return;
    }
    if (!el.tagName && el.textContent) {
      return {
        type: 'text',
        text: el.textContent,
      }
    }
    return null;
  }
};
export const divRule: Rule = {
  // div handling with text in box (bodybox), related content and file embeds
  deserialize(el: HTMLElement, next: NextFunc) {
    if (!el.tagName) return;
    if ((el.tagName.toLowerCase() === 'section' ||
         el.tagName.toLowerCase() === 'body') && 
         el.firstElementChild && divRule.deserialize) {
      return divRule.deserialize(el.firstElementChild, next) 
    }
    if (el.tagName.toLowerCase() !== 'div') return;
    const { type } = el.dataset;
    const children = Array.from(el.childNodes);
    if (el.className === 'c-bodybox') {
      return {
        type: 'bodybox',
        children: children.map(next),
      };
    }
    if (type === 'related-content') {
      return {
        object: 'block',
        type: 'related',
        data: reduceChildElements(el, type),
        children: emptyNodes,
      };
    }
    if (type === 'file') {
      return {
        object: 'block',
        type: 'file',
        children: emptyNodes,
        data: reduceChildElements(el, type),
      };
    }
    return {
      object: 'block',
      type: 'div',
      children: children.map(next),
    };
  },
  serialize(slateObject: Element, children: Node[]) {
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
                .map((node: Node, i: number) => <embed key={i} {...createDataProps(node)} />)}
          </div>
        );
      default:
        return <div>{children}</div>;
    }
  },
};

export const paragraphRule: Rule = {
  // div handling with text in box (bodybox)
  deserialize(el: HTMLElement, next: NextFunc) {
    if (el.tagName?.toLowerCase() !== 'p') return;
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
      children: Array.from(el.childNodes).map(next),
    };
  },
  serialize(slateObject: Element, children: Node[]) {
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

export const listItemRule: Rule = {
  // div handling with text in box (bodybox)
  deserialize(el: HTMLElement, next: NextFunc) {
    if (el.tagName?.toLowerCase() !== 'li') return;
    // const nodes = [...next(el.childNodes), ...emptyNodes];

    return {
      object: 'block',
      type: 'list-item',
      children: Array.from(el.childNodes).map(next),
    };
  },
  serialize(slateObject: Element, children: Node[]) {
    if (slateObject.object !== 'block') return;
    if (slateObject.type !== 'list-item') return;
    return <li>{children}</li>;
  },
};

export const unorderListRules: Rule = {
  deserialize(el: HTMLElement, next: NextFunc) {
    if (el.tagName?.toLowerCase() !== 'ul') return;
    return {
      object: 'block',
      type: 'bulleted-list',
      children: Array.from(el.childNodes).map(next),
    };
  },
  serialize(slateObject: Element, children: Node[]) {
    if (slateObject.object !== 'block') return;
    if (slateObject.type !== 'bulleted-list') {
      return;
    }
    return <ul>{children}</ul>;
  },
};

export const mathRules: Rule = {
  deserialize(el: HTMLElement) {
    const tagName = el.tagName? el.tagName.toLowerCase() : '';
    if (tagName !== 'math') return;
    return {
      object: canParentElementContainBlock(el) ? 'block' : 'inline',
      type: 'mathml',
      data: { ...reduceElementDataAttributes(el), innerHTML: el.innerHTML },
      children: [
        {
          object: 'text',
          text: 'm',
          marks: [],
        },
      ],
    };
  },
  serialize(slateObject: Element) {
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

export const orderListRules: Rule = {
  // div handling with text in box (bodybox)
  deserialize(el: HTMLElement, next: NextFunc) {
    console.log(el);
    if (el.tagName?.toLowerCase() !== 'ol') return;
    const type = el.attributes.getNamedItem('data-type');
    const data = { type: type ? type.value : '' };
    if (data.type === 'letters') {
      return {
        object: 'block',
        type: 'letter-list',
        children: Array.from(el.childNodes).map(next),
        data,
      };
    }
    return {
      object: 'block',
      type: 'numbered-list',
      children: Array.from(el.childNodes).map(next),
    };
  },
  serialize(slateObject: Element, children: Node[]) {
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

export const footnoteRule: Rule = {
  deserialize(el: HTMLElement) {
    if (!el.tagName?.toLowerCase().startsWith('embed')) return;
    const embed = reduceElementDataAttributes(el);
    if (embed.resource !== 'footnote') return;

    return {
      object: 'inline',
      type: 'footnote',
      children: [
        {
          object: 'text',
          text: '#',
          marks: [],
        },
      ],
      data: {
        ...embed,
        authors: embed.authors ? embed.authors.split(';') : [],
      },
    };
  },
  serialize(slateObject: Element) {
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

export const blockRules: Rule = {
  deserialize(el: HTMLElement, next: NextFunc) {
    const block = BLOCK_TAGS[el.tagName?.toLowerCase() as keyof typeof BLOCK_TAGS];
    if (block) {
      return {
        object: 'block',
        type: block,
        children: Array.from(el.childNodes).map(next),
      };
    }
  },
  serialize(slateObject: Element, children: Node[]) {
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
      case 'summary':
        return <summary>{children}</summary>;
    }
  },
};

export const inlineRules: Rule = {
  deserialize(el: HTMLElement, next: NextFunc) {
    const inline = INLINE_TAGS[el.tagName?.toLowerCase()  as keyof typeof INLINE_TAGS];
    const attributes = reduceElementDataAttributes(el);

    if (!inline) return;
    if (inline === 'span' && isEmpty(attributes)) return; // Keep only spans with attributes

    return {
      object: 'inline',
      type: inline,
      data: attributes,
      children: Array.from(el.childNodes).map(next),
    };
  },
  serialize(slateObject: Element, children: Node[]) {
    if (slateObject.object !== 'inline') return;
    const data = slateObject.data.toJS();
    const props = createProps(data);
    const inline = slateObject.type in INLINE_TAGS;
    if (inline) {
      return <slateObject.type {...props}>{children}</slateObject.type>;
    }
  },
};

export const detailsRules: Rule = {
  deserialize(el: HTMLElement, next: NextFunc) {
    console.log(el);
    if (el.tagName?.toLowerCase() !== 'details') return;
    if (el.className === 'c-details--solution-box') {
      return {
        object: 'block',
        type: 'solutionbox',
        children: Array.from(el.childNodes).map(next),
      };
    }
    return {
      object: 'block',
      type: 'details',
      children: Array.from(el.childNodes).map(next),
    };
  },
  serialize(object: Element, children: Node[]) {
    if (object.type !== 'details' && object.type !== 'solutionbox') {
      return;
    }
    const className =
      object.type === 'solutionbox' ? 'c-details--solution-box' : undefined;
    return <details className={className}>{children}</details>;
  },
};

export const tableRules: Rule = {
  deserialize(el: HTMLElement, next: NextFunc) {
    const tagName = el.tagName? el.tagName.toLowerCase() : '';
    const tableTag = TABLE_TAGS[tagName  as keyof typeof TABLE_TAGS];
    if (!tableTag) return;

    const attributes = reduceElementDataAttributes(el);
    return {
      object: 'block',
      type: tableTag,
      data: { isHeader: tagName === 'th', ...attributes },
      children: Array.from(el.childNodes).map(next),
    };
  },
  serialize(object: Element, children: Node[]) {
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

const relatedRule: Rule = {
  serialize(object: Element) {
    if (object.type === 'related') {
      return (
        <div data-type="related-content">
          {object.data.get('nodes') &&
            object.data
              .get('nodes')
              .map((node: Node) => <embed key={uuid()} {...createDataProps(node)} />)}
        </div>
      );
    }
  },
};

export const brRule: Rule = {
  deserialize(el: HTMLElement, next: NextFunc) {
    if (el.tagName?.toLowerCase() !== 'br') return;

    // Transform <br> in blocktags as blocks. This prevents slate from
    // wrapping br in paragraphs (i.e. "<br><br><br>" -> "<p><br><br><br></p>"
    if (canParentElementContainBlock(el)) {
      return {
        object: 'block',
        type: 'br',
        children: Array.from(el.childNodes).map(next),
      };
    }
    // Default to standard slate deserializing if not in a known block
  },
  serialize(slateObject: Element) {
    if (slateObject.type !== 'br') return;
    return <br />;
  },
};

const markRules: Rule = {
  deserialize(el: HTMLElement, next: NextFunc) {
    const tagName: string = el.tagName? el.tagName : '';
    const mark = MARK_TAGS[tagName.toLowerCase() as keyof typeof MARK_TAGS];
    if (!mark) return;
    if (!el.children[0] || el.children[0].textContent === ' ') return;
    return {
      object: 'mark',
      type: mark,
      children: ([].slice.call(el.children)).map(c => next(c)),
    };
  },
  serialize(slateObject: Element, children: Node[]) {
    if (slateObject.object !== 'mark') return;

    switch (slateObject.type) {
      case 'bold':
        return <strong>{children}</strong>;
      case 'italic':
        return <em>{children}</em>;
      case 'underlined':
        return <u>{children}</u>;
      case 'sup':
        return <sup>{children}</sup>;
      case 'sub':
        return <sub>{children}</sub>;
      case 'code':
        return <code>{children}</code>;
    }
  },
};

const linkRules: Rule = {
  deserialize(el: HTMLElement | HTMLLinkElement, next: (child: ChildNode) => any) {
    if (el.tagName?.toLowerCase() !== 'a') return;
    const element = el as HTMLLinkElement
    const children = Array.from(el.childNodes).map(next)
    return {
      object: 'inline',
      type: 'link',
      data: {
        href: element.href ? element.href : '#',
        target: element.target !== '' ? element.target : undefined,
        title: element.title !== '' ? element.title : undefined,
        rel: element.rel !== '' ? element.rel : undefined,
      },
      children,
    };
  },
  serialize(slateObject: Element, children: Node[]) {
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
          data-content-type={data['content-type']}
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
};

const asideRules: Rule = {
  // Aside handling
  deserialize(el: HTMLElement, next: NextFunc) {
    if (el.tagName?.toLowerCase() !== 'aside') return;
    return {
      object: 'block',
      type: 'aside',
      children: Array.from(el.childNodes).map(next),
      data: getAsideType(el),
    };
  },
  serialize(slateObject: Element, children: Node[]) {
    if (slateObject.object !== 'block') return;
    if (slateObject.type !== 'aside') return;
    return <aside {...setAsideTag(slateObject.data)}>{children}</aside>;
  },
};

const topicArticeEmbedRule: Rule[] = [
  {
    // Embeds handling
    deserialize(el: HTMLElement, next: NextFunc) {
      if (el.tagName?.toLowerCase() !== 'embed') return;
      const embed = reduceElementDataAttributes(el);
      if (embed.resource === 'content-link') {
        return {
          object: 'inline',
          type: 'link',
          data: embed,
          children: [
            {
              object: 'text',
              text: embed['link-text']
                ? embed['link-text']
                : 'Ukjent link tekst',
              marks: [],
            },
          ],
        };
      }
      return {
        object: 'block',
        type: 'embed',
        data: reduceElementDataAttributes(el),
      };
    },
    serialize(object: Element) {
      if (object.object !== 'block') return;
      if (object.type !== 'embed') return;
      switch (object.type) {
        case 'embed':
          return <deleteme />;
      }
    },
  },
];

export const learningResourceEmbedRule: Rule[] = [
  {
    deserialize(el: HTMLElement) {
      if (!el.tagName?.toLowerCase().startsWith('embed')) return;
      const embed = reduceElementDataAttributes(el);

      if (el.dataset.resource === 'related-content') return;
      if (embed.resource === 'content-link') {
        return {
          object: 'inline',
          type: 'link',
          data: embed,
          children: [
            {
              object: 'text',
              text: embed['link-text']
                ? embed['link-text']
                : 'Ukjent link tekst',
              marks: [],
            },
          ],
        };
      }
      if (embed.resource === 'concept') {
        return {
          object: 'inline',
          type: 'concept',
          data: embed,
          children: [
            {
              object: 'text',
              text: embed['link-text']
                ? embed['link-text']
                : 'Ukjent forklaringsstekst',
              marks: [],
            },
          ],
        };
      }

      return {
        object: 'block',
        type: 'embed',
        data: embed,
        children: emptyNodes,
      };
    },

    serialize(object: Element) {
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

const RULES: Rule[] = [
  divRule,
  detailsRules,
  textRule,
  orderListRules,
  unorderListRules,
  tableRules,
  paragraphRule,
  listItemRule,
  relatedRule,
  mathRules,
  asideRules,
  blockRules,
  inlineRules,
  brRule,
  markRules,
  footnoteRule,
  linkRules,
];

export const topicArticeRules = RULES.concat(topicArticeEmbedRule); //.concat(RULES);
export const learningResourceRules = RULES.concat(learningResourceEmbedRule);
