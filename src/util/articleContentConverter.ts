/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import escapeHtml from 'escape-html';
import { Descendant, Text } from 'new-slate';
import { Plain } from './slatePlainSerializer';
import { topicArticeRules } from './slateHelpers';
import { convertFromHTML } from './convertFromHTML';
import { sectionSerializer } from '../components/SlateEditor/plugins/section';
import { paragraphSerializer } from '../components/SlateEditor/plugins/paragraph';
import { SlateSerializer } from '../components/SlateEditor/interfaces';
import { breakSerializer } from '../components/SlateEditor/plugins/break';
import { markSerializer } from '../components/SlateEditor/plugins/mark';
import { linkSerializer } from '../components/SlateEditor/plugins/link';
import { blockQuoteSerializer } from '../components/SlateEditor/plugins/blockquote';

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
    BlockQuoteSerializer,
  ];
  const deserialize = (el: HTMLElement | ChildNode) => {
    if (el.nodeType === 3) {
      return { text: el.textContent || '' };
    } else if (el.nodeType !== 1) {
      return null;
    }

    let children = Array.from(el.childNodes).map(deserialize);
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
    const normalizedNodes = convertFromHTML(nodes);

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
  ];

  const serialize = (node: Descendant): string | null => {
    let children;
    if (Text.isText(node)) {
      children = escapeHtml(node.text);
    } else {
      children = node.children.map((n: Descendant) => serialize(n)).join('');
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
    return children;
  };

  const elements = contentValues
    .map((descendants: Descendant[]) =>
      descendants.map((descendant: Descendant) => serialize(descendant)).join(''),
    )
    .join('');

  return elements.replace(/<deleteme><\/deleteme>/g, '');
}

// TODO: Rewrite
export function topicArticleContentToEditorValue(html, fragment = undefined) {
  if (!html) {
    return [createEmptyValue()];
  }
  const serializer = new Html({ rules: topicArticeRules, parseHtml: fragment });

  /*   Slate's default sanitization just obliterates block nodes that contain both
  inline+text children and block children.
  see more here: https://github.com/ianstormtaylor/slate/issues/1497 */
  const json = serializer.deserialize(html, { toJSON: true });
  const value = convertFromHTML(json);
  return value;
}

// TODO: Rewrite
export function topicArticleContentToHTML(value) {
  const serializer = new Html({ rules: topicArticeRules });

  return serializer.serialize(value).replace(/<deleteme><\/deleteme>/g, '');
}

export function plainTextToEditorValue(text: string): Descendant[] {
  return Plain.deserialize(text);
}

export function editorValueToPlainText(editorValue: Descendant[]) {
  return editorValue ? Plain.serialize(editorValue) : '';
}
