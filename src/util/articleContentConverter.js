/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { State } from 'slate';

import Plain from 'slate-plain-serializer';
import Html from 'slate-html-serializer';
import { topicArticeRules, learningResourceRules } from '../util/slateHelpers';

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

export const createEmptyState = () =>
  State.fromJSON({
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
                  ranges: [
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

export function learningResourceContentToEditorState(
  html,
  fragment = undefined,
) {
  if (!html) {
    return [
      {
        state: createEmptyState(),
        index: 0,
      },
    ];
  }
  const sections = sectionSplitter(html);
  const serializer = new Html({
    rules: learningResourceRules,
    parseHtml: fragment,
  });
  /**
   Map over each section and deserialize to get a new slate state. On this state, normalize with the schema rules and use the changed state. this
   implementation was needed because of v0.22.0 change (onBeforeChange was removed from componentWillReceiveProps in editor).
   https://github.com/ianstormtaylor/slate/issues/1111
  */
  return sections.map((section, index) => {
    const state = serializer.deserialize(section);
    return {
      state,
      index,
    };
  });
}

export function learningResourceContentToHTML(contentState) {
  // Use footnoteCounter hack until we have a better footnote api
  const serializer = new Html({
    rules: learningResourceRules,
  });

  return contentState
    .map(section => section.state.isEmpty ? '' : serializer.serialize(section.state))
    .join('')
    .replace(/<deleteme><\/deleteme>/g, '');
}

export function topicArticleContentToEditorState(html, fragment = undefined) {
  if (!html) {
    return createEmptyState();
  }
  const serializer = new Html({ rules: topicArticeRules, parseHtml: fragment });
  return serializer.deserialize(html);
}

export function topicArticleContentToHTML(state) {
  const serializer = new Html({ rules: topicArticeRules });
  return serializer.serialize(state).replace(/<deleteme><\/deleteme>/g, '');
}

export function plainTextToEditorState(text, withDefaultPlainState = false) {
  if (withDefaultPlainState) {
    return text ? Plain.deserialize(text) : Plain.deserialize('');
  }
  return text ? Plain.deserialize(text) : undefined;
}

export function editorStateToPlainText(editorState) {
  return editorState ? Plain.serialize(editorState) : '';
}
