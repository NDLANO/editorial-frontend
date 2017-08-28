import React from 'react';

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

const getEmbedTag = el => {
  const attributes = el.attributes;
  const idTypes = {
    brightcove: 'data-videoid',
    image: 'data-resource_id',
    'content-link': 'data-content-id',
  };
  const size = attributes.getNamedItem('data-size');
  const align = attributes.getNamedItem('data-align');
  const caption = attributes.getNamedItem('data-caption');
  const alt = attributes.getNamedItem('data-alt');
  const resourceType = attributes.getNamedItem('data-resource')
    ? attributes.getNamedItem('data-resource').value
    : '';
  const id = attributes.getNamedItem(idTypes[resourceType]);
  const contentLinkText = attributes.getNamedItem('data-link-text');
  return {
    size: size ? size.value : '',
    align: align ? align.value : '',
    caption: caption ? caption.value : '',
    alt: alt ? alt.value : '',
    id: id ? id.value : '',
    resource: resourceType,
    contentLinkText: contentLinkText ? contentLinkText.value : '',
  };
};

const setEmbedTag = data => ({
  'data-size': data.get('size') || '',
  'data-align': data.get('align') || '',
  'data-caption': data.get('caption') || '',
  'data-alt': data.get('alt') || '',
  'data-id': data.get('id') || 0,
  'data-resource': data.get('resource') || '',
  'data-videoid': data.get('resource') === 'brightcove' ? data.get('id') : '',
  'data-resource_id': data.get('resource') === 'image' ? data.get('id') : '',
});

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
      };
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
        case 'code':
          return (
            <code>
              {children}
            </code>
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
    // Special case for code blocks, which need to grab the nested childNodes.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'pre') return;
      const code = el.childNodes[0];
      const childNodes =
        code && code.tagName.toLowerCase() === 'code'
          ? code.childNodes
          : el.childNodes;

      return {
        kind: 'block',
        type: 'code',
        nodes: next(childNodes),
      };
    },
    serialize(object, children) {
      if (object.kind !== 'block') return;
      if (object.type !== 'pre') return;
      switch (object.type) {
        case 'code':
          return (
            <pre>
              <code>
                {children}
              </code>
            </pre>
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
        nodes: next(el.childNodes),
      };
    },
    serialize(object, children) {
      if (object.kind !== 'a') return;
      const href = object.data.href;
      switch (object.type) {
        case 'a':
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
        data: getEmbedTag(el),
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

const learningResourceEmbedRule = [
  {
    // Embeds handling
    deserialize(el) {
      if (el.tagName.toLowerCase() !== 'embed') return;
      const embedTag = getEmbedTag(el);
      if (embedTag.resource === 'content-link') {
        return {
          kind: 'inline',
          type: 'link',
          data: embedTag,
          nodes: [
            {
              kind: 'text',
              text: embedTag.contentLinkText,
            },
          ],
          isVoid: false,
        };
      }
      return {
        kind: 'block',
        type: 'embed',
        data: getEmbedTag(el),
        isVoid: true,
      };
    },
    serialize(object) {
      if (object.kind !== 'block') return;
      if (object.type !== 'embed') return;
      const embedTags = setEmbedTag(object.data);
      switch (object.type) {
        case 'embed':
          return <embed {...embedTags} />;
      }
    },
  },
];

export const topicArticeRules = topicArticeEmbedRule.concat(RULES);
export const learningResourceRules = learningResourceEmbedRule.concat(RULES);
