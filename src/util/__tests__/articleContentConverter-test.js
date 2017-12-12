/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import jsdom from 'jsdom';
import { State } from 'slate';
import {
  topicArticleContentToEditorState,
  topicArticleContentToHTML,
  learningResourceContentToEditorState,
  learningResourceContentToHTML,
  sectionSplitter,
  isStateEmpty,
  createEmptyState,
} from '../articleContentConverter';
import {
  stateWithInlineFootnotesAndContentLinks,
  brState,
  normalDivState,
  quoteState,
  sectionState,
  headingTwoState,
  listState,
  detailsBoxState,
  tableSlateState,
  stateWithTwoImageEmbeds,
} from './slateMockStates';

const contentHTML = `<section><h2>Lorem ipsum</h2></section>`;

const contentHTMLWithSections = `<section><h2>Section 1</h2></section><section><h2>Section 2</h2></section><section><h2>Section 3</h2></section>`;

const fragment = jsdom.JSDOM.fragment;

test('articleContentConverter is state empty should be true if state is empty', () => {
  const emptyState = createEmptyState();
  expect(isStateEmpty(emptyState)).toBe(true);
  expect(isStateEmpty(State.fromJSON(brState))).toBe(true);
});

test('articleContentConverter is state empty should be false if state is not empty', () => {
  expect(
    isStateEmpty(State.fromJSON(stateWithInlineFootnotesAndContentLinks)),
  ).toBe(false);
  expect(isStateEmpty(State.fromJSON(normalDivState))).toBe(false);
  expect(isStateEmpty(State.fromJSON(quoteState))).toBe(false);
  expect(isStateEmpty(State.fromJSON(sectionState))).toBe(false);
  expect(isStateEmpty(State.fromJSON(headingTwoState))).toBe(false);
  expect(isStateEmpty(State.fromJSON(listState()))).toBe(false);
  expect(isStateEmpty(State.fromJSON(detailsBoxState))).toBe(false);
  expect(isStateEmpty(State.fromJSON(tableSlateState))).toBe(false);
  expect(isStateEmpty(State.fromJSON(stateWithTwoImageEmbeds))).toBe(false);
});

test('articleContentConverter convert topic article content to and from editorState', () => {
  // Todo fix test to handle empty text nodes
  const editorState = topicArticleContentToEditorState(contentHTML, fragment);
  const html = topicArticleContentToHTML(editorState);
  expect(html).toMatchSnapshot();
});

test('articleContentConverter convert learningresource content to and from editorState', () => {
  const editorState = learningResourceContentToEditorState(
    contentHTML,
    fragment,
  );
  const html = learningResourceContentToHTML(editorState);
  expect(html).toMatchSnapshot();
});

test('articleContentConverter convert learningresource content', () => {
  const editorState = learningResourceContentToEditorState(
    contentHTML,
    fragment,
  );
  expect(editorState[0].state.toJSON()).toMatchSnapshot();
});

test('articleContentConverter convert learningresource content with multiple sections to and from editorState', () => {
  const editorState = learningResourceContentToEditorState(
    contentHTMLWithSections,
    fragment,
  );
  const html = learningResourceContentToHTML(editorState);
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
