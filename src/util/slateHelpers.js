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
};

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code',
};

const getEmbedTag = el => {
  const attributes = el.attributes;
  const idTypes = {
    brightcove: 'data-videoid',
    image: 'data-resource_id',
  };
  const size = attributes.getNamedItem('data-size');
  const align = attributes.getNamedItem('data-align');
  const caption = attributes.getNamedItem('data-caption');
  const alt = attributes.getNamedItem('data-alt');
  const resourceType = attributes.getNamedItem('data-resource')
    ? attributes.getNamedItem('data-resource').value
    : '';
  const id = attributes.getNamedItem(idTypes[resourceType]);

  return {
    size: size ? size.value : '',
    align: align ? align.value : '',
    caption: caption ? caption.value : '',
    alt: alt ? alt.value : '',
    id: id ? id.value : '',
    resource: resourceType,
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

/* eslint-disable consistent-return, default-case */

export const RULES = [
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
        case 'underline':
          return (
            <u>
              {children}
            </u>
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
    // Embeds handling
    deserialize(el) {
      if (el.tagName.toLowerCase() !== 'embed') return;
      return {
        kind: 'block',
        type: 'embed',
        data: getEmbedTag(el),
      };
    },
    serialize(object) {
      if (object.kind !== 'block') return;
      if (object.type !== 'embed') return;
      const embedTags = setEmbedTag(object.data);
      console.log(embedTags);
      switch (object.type) {
        case 'embed':
          return <embed {...embedTags} />;
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
        data: {
          href: el.attrs.find(({ name }) => name === 'href').value,
        },
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
