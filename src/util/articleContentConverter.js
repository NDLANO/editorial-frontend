/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Html, Raw, Plain } from 'slate';
import { topicArticeRules, learningResourceRules } from '../util/slateHelpers';

function FootNoteCounter(initialCount = 0) {
  this.count = initialCount;

  FootNoteCounter.prototype.getNextCount = function getNextCount() {
    this.count = this.count + 1;
    return this.count;
  };
}

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

function convertHTMLToSlateEditorState(
  html,
  isBlocks = false,
  contentData = {},
) {
  if (!isBlocks) {
    if (!html) {
      return createEmptyState();
    }
    const serializer = new Html({ rules: topicArticeRules });
    return serializer.deserialize(html);
  }

  let contentState;
  if (!html) {
    contentState = [
      {
        state: createEmptyState(),
        index: 0,
      },
    ];
  } else {
    const sections = extractSections(html);
    const serializer = new Html({ rules: learningResourceRules(contentData) });
    contentState = sections.map((section, index) => ({
      state: serializer.deserialize(section.replace(/\s\s+/g, '')),
      index,
    }));
  }
  return contentState;
}

function convertSlateEditorStatetoHTML(contentState, isBlocks = false) {
  if (!isBlocks) {
    const serializer = new Html({ rules: topicArticeRules });
    return serializer
      .serialize(contentState)
      .replace(/<deleteme><\/deleteme>/g, '');
  }
  const html = [];

  // Use footNoteCounter hack until we have a better footnote api
  const serializer = new Html({
    rules: learningResourceRules({}, new FootNoteCounter()),
  });

  contentState.map(section =>
    html.push(
      serializer
        .serialize(section.state)
        .replace(/<deleteme><\/deleteme>/g, ''),
    ),
  );
  return html.join('');
}

function convertTextToSlateEditorState(text, withDefaultPlainState = false) {
  if (withDefaultPlainState) {
    return text ? Plain.deserialize(text) : Plain.deserialize('');
  }
  return text ? Plain.deserialize(text) : undefined;
}

function convertSlateEditorStateToText(editorState) {
  return editorState ? Plain.serialize(editorState) : '';
}

export default {
  slateToHtml: convertSlateEditorStatetoHTML,
  toSlateEditorState: convertHTMLToSlateEditorState,
  toPlainSlateEditorState: convertTextToSlateEditorState,
  slateToText: convertSlateEditorStateToText,
};
