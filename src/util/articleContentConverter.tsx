/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import escapeHtml from 'escape-html';
import React from 'react';
import { Descendant, Node, Text } from 'slate';
import { renderToStaticMarkup } from 'react-dom/server';
import { Plain } from './slatePlainSerializer';
import { convertFromHTML } from './convertFromHTML';
import { sectionSerializer } from '../components/SlateEditor/plugins/section';
import { paragraphSerializer } from '../components/SlateEditor/plugins/paragraph';
import { SlateSerializer } from '../components/SlateEditor/interfaces';
import { breakSerializer } from '../components/SlateEditor/plugins/break';
import { markSerializer } from '../components/SlateEditor/plugins/mark';
import { linkSerializer } from '../components/SlateEditor/plugins/link';
import { blockQuoteSerializer } from '../components/SlateEditor/plugins/blockquote';
import { headingSerializer } from '../components/SlateEditor/plugins/heading';
import { listSerializer } from '../components/SlateEditor/plugins/list';
import { footnoteSerializer } from '../components/SlateEditor/plugins/footnote';
import { mathmlSerializer } from '../components/SlateEditor/plugins/mathml';
import { conceptSerializer } from '../components/SlateEditor/plugins/concept';
import { asideSerializer } from '../components/SlateEditor/plugins/aside';
import { fileSerializer } from '../components/SlateEditor/plugins/file';
import { detailsSerializer } from '../components/SlateEditor/plugins/details';
import { EmbedElement } from '../components/SlateEditor/plugins/embed';
import { bodyboxSerializer } from '../components/SlateEditor/plugins/bodybox';
import { tableSerializer } from '../components/SlateEditor/plugins/table';
import { relatedSerializer } from '../components/SlateEditor/plugins/related';
import { embedSerializer } from '../components/SlateEditor/plugins/embed';
import { codeblockSerializer } from '../components/SlateEditor/plugins/codeBlock';
import { defaultEmbedBlock } from '../components/SlateEditor/plugins/embed/utils';
import { parseEmbedTag, createEmbedTag } from './embedTagHelpers';
import { Embed } from '../interfaces';

export const sectionSplitter = (html: string) => {
  const node = document.createElement('div');
  node.insertAdjacentHTML('beforeend', html);
  const sections = [];
  for (let i = 0; i < node.children.length; i += 1) {
    sections.push(node.children[i].outerHTML);
  }
  node.remove();
  return sections;
};

export const createEmptyValue = () => [
  {
    type: 'section',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            text: '',
          },
        ],
      },
    ],
  },
];

const rules: SlateSerializer[] = [
  paragraphSerializer,
  sectionSerializer,
  breakSerializer,
  markSerializer,
  linkSerializer,
  blockQuoteSerializer,
  headingSerializer,
  footnoteSerializer,
  mathmlSerializer,
  conceptSerializer,
  asideSerializer,
  fileSerializer,
  detailsSerializer,
  bodyboxSerializer,
];

export const learningResourceContentToEditorValue = (html: string) => {
  if (!html) {
    return [createEmptyValue()];
  }

  const rules: SlateSerializer[] = [
    paragraphSerializer,
    sectionSerializer,
    breakSerializer,
    markSerializer,
    linkSerializer,
    blockQuoteSerializer,
    headingSerializer,
    listSerializer,
    footnoteSerializer,
    mathmlSerializer,
    conceptSerializer,
    asideSerializer,
    fileSerializer,
    detailsSerializer,
    tableSerializer,
    relatedSerializer,
    codeblockSerializer,
    embedSerializer,
    bodyboxSerializer,
  ];
  const deserialize = (el: HTMLElement | ChildNode) => {
    if (el.nodeType === 3) {
      return { text: el.textContent || '' };
    } else if (el.nodeType !== 1) {
      return { text: '' };
    }

    let children = Array.from(el.childNodes).flatMap(deserialize);
    if (children.length === 0) {
      children = [{ text: '' }];
    }

    for (const rule of rules) {
      if (!rule.deserialize) {
        continue;
      }

      // Already checked that nodeType === 1 -> el must be of type Element.
      // HTMLElement is a subset of Element.
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
      const ret = rule.deserialize(el as HTMLElement, children);

      if (ret === undefined) {
        continue;
      } else {
        return ret;
      }
    }

    return { text: el.textContent || '' };
  };

  const sections = sectionSplitter(html);

  return sections.map(section => {
    const document = new DOMParser().parseFromString(section, 'text/html');
    const nodes = deserialize(document.body.children[0]);

    // Deserialize function sometimes return a list of descendants, but that should never occur at root level.
    // Expect nodes to always be returned.
    const normalizedNodes = convertFromHTML(Node.isNodeList(nodes) ? nodes[0] : nodes);

    return [normalizedNodes];
  });
};

export function learningResourceContentToHTML(contentValues: Descendant[][]) {
  const rules: SlateSerializer[] = [
    paragraphSerializer,
    sectionSerializer,
    breakSerializer,
    markSerializer,
    linkSerializer,
    blockQuoteSerializer,
    headingSerializer,
    listSerializer,
    footnoteSerializer,
    mathmlSerializer,
    conceptSerializer,
    asideSerializer,
    fileSerializer,
    detailsSerializer,
    tableSerializer,
    relatedSerializer,
    embedSerializer,
    bodyboxSerializer,
    codeblockSerializer,
  ];

  const serialize = (node: Descendant): JSX.Element | null => {
    let children: (JSX.Element | null)[];
    if (Text.isText(node)) {
      children = [escapeHtml(node.text)];
    } else {
      children = node.children.map((n: Descendant) => serialize(n));
    }

    for (const rule of rules) {
      if (!rule.serialize) {
        continue;
      }
      const ret = rule.serialize(node, children);

      if (ret === undefined) {
        continue;
      } else if (ret === null) {
        return null;
      } else {
        return ret;
      }
    }
    return <>{children}</>;
  };

  const elements = contentValues
    .map((descendants: Descendant[]) =>
      descendants
        .map((descendant: Descendant) => {
          const html = serialize(descendant);
          return html ? renderToStaticMarkup(html) : '';
        })
        .join(''),
    )
    .join('');

  return elements.replace(/<deleteme><\/deleteme>/g, '');
}

export function topicArticleContentToEditorValue(html: string) {
  if (!html) {
    return createEmptyValue();
  }
  const deserialize = (el: HTMLElement | ChildNode) => {
    if (el.nodeType === 3) {
      return { text: el.textContent || '' };
    } else if (el.nodeType !== 1) {
      return { text: '' };
    }

    let children = Array.from(el.childNodes).flatMap(deserialize);
    if (children.length === 0) {
      children = [{ text: '' }];
    }

    for (const rule of rules) {
      if (!rule.deserialize) {
        continue;
      }

      // Already checked that nodeType === 1 -> el must be of type Element.
      // HTMLElement is a subset of Element.
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
      const ret = rule.deserialize(el as HTMLElement, children);

      if (ret === undefined) {
        continue;
      } else {
        return ret;
      }
    }

    return { text: el.textContent || '' };
  };

  const document = new DOMParser().parseFromString(html, 'text/html');
  const nodes = deserialize(document.body.children[0]);
  const normalizedNodes = convertFromHTML(Node.isNodeList(nodes) ? nodes[0] : nodes);
  return [normalizedNodes];
}

export function topicArticleContentToHTML(value: Descendant[]) {
  const serialize = (node: Descendant): JSX.Element | null => {
    let children: (JSX.Element | null)[];
    if (Text.isText(node)) {
      children = escapeHtml(node.text);
    } else {
      children = node.children.map((n: Descendant) => serialize(n));
    }

    for (const rule of rules) {
      if (!rule.serialize) {
        continue;
      }
      const ret = rule.serialize(node, children);

      if (ret === undefined) {
        continue;
      } else if (ret === null) {
        return null;
      } else {
        return ret;
      }
    }
    return <>{children}</>;
  };

  const elements = value
    .map((descendant: Descendant) => {
      const html = serialize(descendant);
      return html ? renderToStaticMarkup(html) : '';
    })
    .join('');
  return elements.replace(/<deleteme><\/deleteme>/g, '');
}

export function plainTextToEditorValue(text: string): Descendant[] {
  return Plain.deserialize(text);
}

export function editorValueToPlainText(editorValue: Descendant[]) {
  return editorValue ? Plain.serialize(editorValue) : '';
}

export function embedToEditorValue(embed?: Embed) {
  return embed ? [defaultEmbedBlock(embed) as EmbedElement] : [];
}

export function embedTagToEditorValue(embedTag: string) {
  const embed = parseEmbedTag(embedTag);
  return embed ? embedToEditorValue(embed) : [];
}

export function editorValueToEmbed(editorValue: EmbedElement[]) {
  return editorValue[0]?.data;
}

export function editorValueToEmbedTag(editorValue: EmbedElement[]) {
  const embed = editorValueToEmbed(editorValue);
  if (embed) {
    const embedTag = createEmbedTag(embed);
    return embedTag ? renderToStaticMarkup(embedTag) : '';
  }
  return '';
}
