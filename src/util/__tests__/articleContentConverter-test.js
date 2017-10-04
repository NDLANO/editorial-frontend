/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  topicArticleContentToEditorState,
  topicArticleContentToHTML,
  learningResourceContentToEditorState,
  learningResourceContentToHTML,
} from '../articleContentConverter';

const contentHTML = `<section><h2>Lorem ipsum</h2></section>`;

const learningResourceContent = `<section><h2>Lorem ipsum</h2><embed date-resource-type="image"/></section>`;

const contentHTMLWithSections = `<section><h2>Section 1</h2></section><section><h2>Section 2</h2></section><section><h2>Section 3</h2></section>`;

test('articleContentConverter convert topic article content to and from editorState', () => {
  // Todo fix test to handle empty text nodes
  const editorState = topicArticleContentToEditorState(contentHTML);
  const html = topicArticleContentToHTML(editorState);
  expect(html).toMatchSnapshot();
});

test('articleContentConverter convert learningresource content to and from editorState', () => {
  const editorState = learningResourceContentToEditorState(contentHTML);
  const html = learningResourceContentToHTML(editorState);
  expect(html).toMatchSnapshot();
});

test('articleContentConverter convert learningresource content with rule applied', () => {
  const editorState = learningResourceContentToEditorState(
    learningResourceContent,
  );
  expect(editorState[0].state.toJSON()).toMatchSnapshot();
});

test('articleContentConverter convert learningresource content with no rule applied', () => {
  const editorState = learningResourceContentToEditorState(contentHTML);
  expect(editorState[0].state.toJSON()).toMatchSnapshot();
});

test('articleContentConverter convert learningresource content with multiple sections to and from editorState', () => {
  const editorState = learningResourceContentToEditorState(
    contentHTMLWithSections,
  );
  const html = learningResourceContentToHTML(editorState);
  expect(html).toMatchSnapshot();
});
