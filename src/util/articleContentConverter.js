/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Value } from 'slate';
import { Node } from 'new-slate';
import Html from 'slate-html-serializer';
import { topicArticeRules, learningResourceRules } from './slateHelpers';
import { convertFromHTML } from './convertFromHTML';

export const sectionSplitter = html => {
  const node = document.createElement('div');
  node.insertAdjacentHTML('beforeend', html);
  const sections = [];
  for (let i = 0; i < node.children.length; i += 1) {
    sections.push(node.children[i].outerHTML);
  }
  node.remove();
  return sections;
};

export const createEmptyValue = () =>
  Value.fromJSON({
    document: {
      nodes: [
        {
          object: 'block',
          type: 'section',
          nodes: [
            {
              object: 'block',
              type: 'paragraph',
              nodes: [
                {
                  object: 'text',
                  text: '',
                },
              ],
            },
          ],
        },
      ],
    },
  });

export function learningResourceContentToEditorValue(html, fragment = undefined) {
  if (!html) {
    return [createEmptyValue()];
  }

  const serializer = new Html({
    rules: learningResourceRules,
    parseHtml: fragment,
  });

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
    const json = serializer.deserialize(section, {
      toJSON: true,
      parseHtml: fragment,
    });

    const value = convertFromHTML(json);

    return value;
  });
}

export function learningResourceContentToHTML(contentValues) {
  // Use footnoteCounter hack until we have a better footnote api
  const serializer = new Html({
    rules: learningResourceRules,
  });

  return contentValues
    .map(value => serializer.serialize(value))
    .join('')
    .replace(/<deleteme><\/deleteme>/g, '');
}

export function topicArticleContentToEditorValue(html, fragment = undefined) {
  if (!html) {
    return createEmptyValue();
  }
  const serializer = new Html({ rules: topicArticeRules, parseHtml: fragment });

  /*   Slate's default sanitization just obliterates block nodes that contain both
  inline+text children and block children.
  see more here: https://github.com/ianstormtaylor/slate/issues/1497 */
  const json = serializer.deserialize(html, { toJSON: true });
  const value = convertFromHTML(json);
  return value;
}

export function topicArticleContentToHTML(value) {
  const serializer = new Html({ rules: topicArticeRules });

  return serializer.serialize(value).replace(/<deleteme><\/deleteme>/g, '');
}

const Plain = {
  serialize: nodes => {
    return nodes.map(n => Node.string(n)).join('\n');
  },
  deserialize: text => {
    return text.split('\n').map(t => ({
      type: 'paragraph',
      children: [{ text: t }],
    }));
  },
};

export function plainTextToEditorValue(text, withDefaultPlainValue = false) {
  if (withDefaultPlainValue) {
    return text ? Plain.deserialize(text) : Plain.deserialize('');
  }
  return text ? Plain.deserialize(text) : undefined;
}

export function editorValueToPlainText(editorValue) {
  return editorValue ? Plain.serialize(editorValue) : '';
}
