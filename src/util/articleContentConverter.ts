/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node, Editor, Element } from 'slate';
import { topicArticeRules, learningResourceRules } from './slateHelpers';
import { convertFromHTML } from './convertFromHTML';
import { serializeNodeToPlain, deserializePlain, serializeHtml, deserializeHtml} from './serializer';

export const sectionSplitter = (html: string): string[] => {
  const node = document.createElement('div');
  node.insertAdjacentHTML('beforeend', html.toString());
  const sections = [];
  for (let i = 0; i < node.children.length; i += 1) {
    sections.push(node.children[i].outerHTML);
  }
  node.remove();
  return sections;
};

// TODO  find a viable replacement for this.
export const createEmptyValue = (): Element =>
  ({
    children: [
      {
        object: 'block',
        type: 'section',
        children: [
          {
            object: 'block',
            type: 'paragraph',
            children: [
              {
                object: 'text',
                text: '',
              },
            ],
          },
        ],
      },
    ],
    });

export const learningResourceContentToEditorValue = (
  html: string,
  fragment = undefined,
) => {
  if (!html) {
    return [createEmptyValue()];
  }
  const sections = sectionSplitter(html);

  /**
   Map over each section and deserialize to get a new slate value. On this value, normalize with the schema rules and use the changed value. this
   implementation was needed because of v0.22.0 change (onBeforeChange was removed from componentWillReceiveProps in editor).
   https://github.com/ianstormtaylor/slate/issues/1111
  */
  return sections.map((section, index) => {
    /*   Slate's default sanitization just obliterates block nodes that contain both
    inline+text children and block children.
    see more here: https://github.com/ianstormtaylor/slate/issues/1497 */
    const json = deserializeHtml(section, learningResourceRules)
    console.log(json);

    // FIXME Childrens are mangled and undefined, pls fix
    const value = convertFromHTML(json);

    return value;
  });
}

export const learningResourceContentToHTML = (contentValues: Node[]) => {
  // Use footnoteCounter hack until we have a better footnote api
  return contentValues
    .map(value => serializeHtml(value, learningResourceRules))
    .join('')
    .replace(/<deleteme><\/deleteme>/g, '');
}

export const topicArticleContentToEditorValue = (html: HTMLElement, fragment = undefined) => {
  if (!html) {
    return createEmptyValue();
  }

  /*   Slate's default sanitization just obliterates block nodes that contain both
  inline+text children and block children.
  see more here: https://github.com/ianstormtaylor/slate/issues/1497 */
  const json = deserializeHtml(html, topicArticeRules).toJSON();
  const value = convertFromHTML(json);
  return value;
}

export const topicArticleContentToHTML = (value: Node) => {
  return serializeHtml(value, topicArticeRules).replace(/<deleteme><\/deleteme>/g, '');
}

export const plainTextToEditorValue = (text: string, withDefaultPlainValue = false): Node[] | undefined => {
  if (withDefaultPlainValue) {
    return text ? deserializePlain(text) : deserializePlain('');
  }
  return text ? deserializePlain(text) : undefined;
}

export const editorValueToPlainText = (editorValue: Editor) => {
  return editorValue ? serializeNodeToPlain(editorValue.children) : '';
}
