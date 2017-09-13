/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Html, Raw, Plain } from 'slate';
import { topicArticeRules, learningResourceRules } from '../util/slateHelpers';

export const createEmptyState = () =>
  Raw.deserialize(
    {
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
                  text: '',
                },
              ],
            },
          ],
        },
      ],
    },
    { terse: true },
  );

// TODO: Find a better way to extract each section into an array.
function extractSections(html) {
  return html
    .split('</section>')
    .filter(section => section.length > 0)
    .map(section => `${section}</section>`);
}

export function learningResourceContentToEditorState(html) {
  if (!html) {
    return [
      {
        state: createEmptyState(),
        index: 0,
      },
    ];
  }
  const sections = extractSections(html);
  const serializer = new Html({ rules: learningResourceRules });
  return sections.map((section, index) => ({
    state: serializer.deserialize(section.replace(/\s\s+/g, '')),
    index,
  }));
}

export function learningResourceContentToHTML(contentState) {
  const serializer = new Html({ rules: learningResourceRules });
  const html = [];
  contentState.map(section => html.push(serializer.serialize(section.state)));
  return html.join('');
}

export function topicArticleContentToEditorState(html) {
  if (!html) {
    return createEmptyState();
  }
  const serializer = new Html({ rules: topicArticeRules });
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
