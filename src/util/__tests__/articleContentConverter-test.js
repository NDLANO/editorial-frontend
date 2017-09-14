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
} from '../articleContentConverter';

const contentHTML = `<section><h2>Lorem ipsum</h2></section>`;

test('articleContentConverter convert topic article content to and from editorState', () => {
  // Todo fix test to handle empty text nodes
  const editorState = topicArticleContentToEditorState(contentHTML);
  const html = topicArticleContentToHTML(editorState);
  expect(html).toMatchSnapshot();
});
