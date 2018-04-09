/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Value } from 'slate';

import Plain from 'slate-plain-serializer';
import Html from 'slate-html-serializer';
import { topicArticeRules, learningResourceRules } from '../util/slateHelpers';
import { textWrapper } from '../util/invalidTextWrapper';

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

export const isValueEmpty = value => {
  const { document } = value;
  const { nodes } = document;
  if (nodes.isEmpty()) {
    return true;
  } else if (
    nodes.first().type === 'section' &&
    nodes.first().nodes.size === 1 &&
    nodes.first().nodes.first().isEmpty
  ) {
    return true;
  } else if (
    nodes.size === 1 &&
    nodes.first().type !== 'section' &&
    nodes.first().isEmpty
  ) {
    return true;
  }
  return false;
};

export const createEmptyValue = () =>
  Value.fromJSON({
    document: {
      nodes: [
        {
          kind: 'block',
          type: 'section',
          nodes: [
            {
              kind: 'block',
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  leaves: [
                    {
                      text: '',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  });

export function learningResourceContentToEditorValue(
  html,
  fragment = undefined,
) {
  if (!html) {
    return [
      {
        value: createEmptyValue(),
        index: 0,
      },
    ];
  }
  const serializer = new Html({
    rules: learningResourceRules,
    parseHtml: fragment,
  });

  /*   Check the html for invalid text nodes,
  see more here: https://github.com/ianstormtaylor/slate/issues/1497 */
  const parser = textWrapper(new Html());
  serializer.parseHtml = parser;

  const sections = sectionSplitter(html);

  /**
   Map over each section and deserialize to get a new slate value. On this value, normalize with the schema rules and use the changed value. this
   implementation was needed because of v0.22.0 change (onBeforeChange was removed from componentWillReceiveProps in editor).
   https://github.com/ianstormtaylor/slate/issues/1111
  */
  return sections.map((section, index) => {
    const value = serializer.deserialize(section);
    return {
      value,
      index,
    };
  });
}

export function learningResourceContentToHTML(contentValue) {
  // Use footnoteCounter hack until we have a better footnote api
  const serializer = new Html({
    rules: learningResourceRules,
  });

  return contentValue
    .map(
      section =>
        isValueEmpty(section.value) ? '' : serializer.serialize(section.value),
    )
    .join('')
    .replace(/<deleteme><\/deleteme>/g, '');
}

export function topicArticleContentToEditorValue(html, fragment = undefined) {
  if (!html) {
    return createEmptyValue();
  }
  const serializer = new Html({ rules: topicArticeRules, parseHtml: fragment });
  return serializer.deserialize(html);
}

export function topicArticleContentToHTML(value) {
  const serializer = new Html({ rules: topicArticeRules });

  return isValueEmpty(value)
    ? undefined
    : serializer.serialize(value).replace(/<deleteme><\/deleteme>/g, '');
}

export function plainTextToEditorValue(text, withDefaultPlainValue = false) {
  if (withDefaultPlainValue) {
    return text ? Plain.deserialize(text) : Plain.deserialize('');
  }
  return text ? Plain.deserialize(text) : undefined;
}

export function editorValueToPlainText(editorValue) {
  return editorValue ? Plain.serialize(editorValue) : '';
}
