/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import jsdom from 'jsdom';
import {
  topicArticleContentToEditorValue,
  topicArticleContentToHTML,
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
  sectionSplitter,
} from '../articleContentConverter';

const contentHTML = `<section><h2>Lorem ipsum</h2></section>`;

const contentHTMLWithSections = `<section><h2>Section 1</h2></section><section><h2>Section 2</h2></section><section><h2>Section 3</h2></section>`;

const fragment = jsdom.JSDOM.fragment;

test('articleContentConverter convert topic article content to and from editorValue', () => {
  // Todo fix test to handle empty text nodes
  const editorValue = topicArticleContentToEditorValue(contentHTML, fragment);
  const html = topicArticleContentToHTML(editorValue);
  expect(html).toMatchSnapshot();
});

test('articleContentConverter convert learningresource content to and from editorValue', () => {
  const editorValue = learningResourceContentToEditorValue(
    contentHTML,
    fragment,
  );
  const html = learningResourceContentToHTML(editorValue);
  expect(html).toMatchSnapshot();
});

test('articleContentConverter convert learningresource content', () => {
  const editorValue = learningResourceContentToEditorValue(
    contentHTML,
    fragment,
  );
  expect(editorValue[0].value.toJSON()).toMatchSnapshot();
});

test('articleContentConverter convert learningresource content with multiple sections to and from editorValue', () => {
  const editorValue = learningResourceContentToEditorValue(
    contentHTMLWithSections,
    fragment,
  );
  const html = learningResourceContentToHTML(editorValue);
  expect(html).toMatchSnapshot();
});

const doubleNestedSections =
  '<section>Seksjon 1</section><section><p>test paragraf</p><section>Seksjon 2 nested</section></section>';

const trippleNestedSections =
  '<section>Seksjon 1</section><section><p>test paragraf</p><section><section>Seksjon 2 nested</section></section></section><section>Seksjon 3</section>';

test('util/sectionSplitter splits doubleNestedSections into array', () => {
  expect(sectionSplitter(doubleNestedSections)).toMatchSnapshot();
});

test('util/domOperations trippleNestedSections into array', () => {
  expect(sectionSplitter(trippleNestedSections)).toMatchSnapshot();
});
