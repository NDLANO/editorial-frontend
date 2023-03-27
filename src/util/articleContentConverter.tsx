/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { cloneElement } from 'react';
import escapeHtml from 'escape-html';
import compact from 'lodash/compact';
import toArray from 'lodash/toArray';
import { Descendant, Element, Node, Text } from 'slate';
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
import { inlineConceptSerializer } from '../components/SlateEditor/plugins/concept/inline';
import { asideSerializer } from '../components/SlateEditor/plugins/aside';
import { fileSerializer } from '../components/SlateEditor/plugins/file';
import { detailsSerializer } from '../components/SlateEditor/plugins/details';
import { bodyboxSerializer } from '../components/SlateEditor/plugins/bodybox';
import { tableSerializer } from '../components/SlateEditor/plugins/table';
import { relatedSerializer } from '../components/SlateEditor/plugins/related';
import { embedSerializer } from '../components/SlateEditor/plugins/embed';
import { codeblockSerializer } from '../components/SlateEditor/plugins/codeBlock';
import { noEmbedSerializer } from '../components/SlateEditor/plugins/noEmbed';
import { defaultEmbedBlock, isSlateEmbed } from '../components/SlateEditor/plugins/embed/utils';
import { parseEmbedTag, createEmbedTag } from './embedTagHelpers';
import { Embed } from '../interfaces';
import { divSerializer } from '../components/SlateEditor/plugins/div';
import { spanSerializer } from '../components/SlateEditor/plugins/span';
import { TYPE_PARAGRAPH } from '../components/SlateEditor/plugins/paragraph/types';
import { TYPE_SECTION } from '../components/SlateEditor/plugins/section/types';
import { conceptListSerializer } from '../components/SlateEditor/plugins/conceptList';
import { blockConceptSerializer } from '../components/SlateEditor/plugins/concept/block';

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

export const createEmptyValue = (): Descendant[] => [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_PARAGRAPH,
        children: [
          {
            text: '',
          },
        ],
      },
    ],
  },
];

// Rules are checked from first to last
const extendedRules: SlateSerializer[] = [
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
  conceptListSerializer,
  inlineConceptSerializer,
  blockConceptSerializer,
  asideSerializer,
  fileSerializer,
  detailsSerializer,
  tableSerializer,
  relatedSerializer,
  codeblockSerializer,
  embedSerializer,
  bodyboxSerializer,
  divSerializer,
  spanSerializer,
];

// Rules are checked from first to last
const commonRules: SlateSerializer[] = [
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
  inlineConceptSerializer,
  noEmbedSerializer,
  divSerializer,
  spanSerializer,
];

const articleContentToHTML = (value: Descendant[], rules: SlateSerializer[]) => {
  const serialize = (node: Descendant, nodeIdx: number): JSX.Element | null => {
    let children: JSX.Element[];
    if (Text.isText(node)) {
      children = [escapeHtml(node.text)];
    } else {
      children = compact(node.children.map((n: Descendant, idx: number) => serialize(n, idx)));
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
        return cloneElement(ret, { key: nodeIdx });
      }
    }
    return <>{children}</>;
  };

  const elements = value
    .map((descendant: Descendant, idx: number) => {
      const html = serialize(descendant, idx);
      return html ? renderToStaticMarkup(html) : '';
    })
    .join('');

  return elements.replace(/<deleteme><\/deleteme>/g, '');
};

const articleContentToEditorValue = (html: string, rules: SlateSerializer[]) => {
  if (!html) {
    return createEmptyValue();
  }
  const deserialize = (el: HTMLElement | ChildNode): Descendant | Descendant[] => {
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
      // Already checked that nodeType === 1 -> el must be of type HTMLElement.
      const ret = rule.deserialize(el as HTMLElement, children);
      if (ret === undefined) {
        continue;
      } else {
        return ret;
      }
    }

    return children;
  };

  const document = new DOMParser().parseFromString(html, 'text/html');
  const nodes = toArray(document.body.children).map(deserialize);
  const normalizedNodes = compact(nodes.map((n) => convertFromHTML(Node.isNodeList(n) ? n[0] : n)));
  return normalizedNodes;
};

export const blockContentToEditorValue = (html: string): Descendant[] => {
  return articleContentToEditorValue(html, extendedRules);
};

export function blockContentToHTML(contentValues: Descendant[]) {
  return articleContentToHTML(contentValues, extendedRules);
}

export function inlineContentToEditorValue(html: string) {
  return articleContentToEditorValue(html, commonRules);
}

export function inlineContentToHTML(value: Descendant[]) {
  return articleContentToHTML(value, commonRules);
}

export function plainTextToEditorValue(text: string): Descendant[] {
  return Plain.deserialize(text);
}

export function editorValueToPlainText(editorValue?: Descendant[]) {
  return editorValue ? Plain.serialize(editorValue) : '';
}

export function embedToEditorValue(embed?: Partial<Embed>) {
  return embed ? [defaultEmbedBlock(embed)] : [];
}

export function embedTagToEditorValue(embedTag: string) {
  const embed = parseEmbedTag(embedTag);
  return embed ? embedToEditorValue(embed) : [];
}

export function editorValueToEmbed(editorValue?: Descendant[]) {
  const embed = editorValue && editorValue[0];
  if (embed && isSlateEmbed(embed)) return embed.data;
  else return undefined;
}

export function editorValueToEmbedTag(editorValue?: Descendant[]) {
  const embed = editorValueToEmbed(editorValue);
  if (embed) {
    const embedTag = createEmbedTag(embed);
    return embedTag ? renderToStaticMarkup(embedTag) : '';
  }
  return '';
}
