/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { fromJS } from 'immutable';
import renderer from 'react-test-renderer';
import jsdom from 'jsdom';
import { State } from 'slate';
import Html from 'slate-html-serializer';
import {
  stateWithInlineFootnotesAndContentLinks,
  stateWithTwoImageEmbeds,
  tableSlateState,
  listState,
  detailsBoxState,
  headingTwoState,
  sectionState,
  quoteState,
  brState,
  normalDivState,
} from './slateMockStates';
import {
  footnoteRule,
  learningResourceEmbedRule,
  findNodesByType,
  divRule,
  toJSON,
  blockRules,
  orderListRules,
  tableRules,
  listItemRule,
  paragraphRule,
  learningResourceRules,
} from '../slateHelpers';
import { standardArticleHTML, standardArticleState } from './slateMockArticle';

const fragment = jsdom.JSDOM.fragment;

test('serialize embed block', () => {
  const obj = {
    kind: 'block',
    type: 'embed',
    data: fromJS({ caption: 'test' }),
  };
  const tag = learningResourceEmbedRule[0].serialize(obj);

  expect(renderer.create(tag).toJSON()).toMatchSnapshot();
});

test('find embed nodes in slate document', () => {
  const document = State.fromJSON(stateWithTwoImageEmbeds).document;
  const embeds = findNodesByType(document, 'embed');
  expect(embeds.length).toBe(2);
});

test('find footnote nodes in slate document', () => {
  const document = State.fromJSON(stateWithInlineFootnotesAndContentLinks)
    .document;
  const embeds = findNodesByType(document, 'footnote');
  expect(embeds.length).toBe(2);
});

test('serialize bodybox block', () => {
  const obj = {
    kind: 'block',
    type: 'bodybox',
  };
  const children = <p>test</p>;
  const bodybox = divRule.serialize(obj, children);
  expect(renderer.create(bodybox).toJSON()).toMatchSnapshot();
});

test('deserialize bodybox block', () => {
  const serializer = new Html({ rules: [divRule], parseHtml: fragment });
  const deserialized = serializer.deserialize(
    '<div class="c-bodybox">test</div>',
  );

  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('deserializing a normal div block', () => {
  const serializer = new Html({
    rules: [divRule, paragraphRule],
    parseHtml: fragment,
  });
  const div = '<div><p>A paragraph</p></div>';
  const deserialized = serializer.deserialize(div);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing a normal div block', () => {
  const serializer = new Html({
    rules: [paragraphRule, divRule],
    parseHtml: fragment,
  });
  const state = State.fromJSON(normalDivState);
  const serialized = serializer.serialize(state);
  expect(serialized).toMatchSnapshot();
});

test('deserialize footnote', () => {
  const serializer = new Html({
    rules: [footnoteRule],
    parseHtml: fragment,
  });
  const deserialized = serializer.deserialize(
    `<embed data-title="Apple Watch" data-year="2015" data-resource="footnote" data-authors="Jony Ive" data-edition="2" data-publisher="Apple" data-type=""><embed data-title="iPhone" data-year="2007" data-resource="footnote" data-authors="Steve Jobs;Jony Ive" data-edition="1" data-publisher="Apple" data-type="">`,
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serialize footnote', () => {
  const obj = {
    isVoid: false,
    kind: 'inline',
    data: fromJS({
      title: 'Apple Watch',
      type: 'product',
      year: '2015',
      edition: '4',
      publisher: 'Apple',
      authors: ['Jony Ive'],
    }),
    nodes: [
      {
        kind: 'text',
        ranges: [
          {
            kind: 'range',
            marks: [],
            text: '#',
          },
        ],
      },
    ],
    type: 'footnote',
  };
  const footnote = footnoteRule.serialize(obj);
  expect(renderer.create(footnote).toJSON()).toMatchSnapshot();
});

test('deserializing any heading becomes heading-two', () => {
  const serializer = new Html({ rules: [blockRules], parseHtml: fragment });
  const deserialized = serializer.deserialize(
    '<h1>heading 1</h1><h2>heading 2</h2><h3>heading 3</h3><h4>heading 4</h4><h5>heading 5</h5><h6>heading 6</h6>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

const tableHTML =
  '<table><thead><tr><th>column 1</th><th>column 2</th></tr></thead><tbody><tr><td>column 1</td><td>column 2</td></tr></tbody></table>';

test('deserializing table', () => {
  const serializer = new Html({ rules: [tableRules], parseHtml: fragment });
  const deserialized = serializer.deserialize(tableHTML);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing table', () => {
  const serializer = new Html({ rules: [tableRules], parseHtml: fragment });
  const state = State.fromJSON(tableSlateState);
  const serialized = serializer.serialize(state);
  expect(serialized).toMatch(tableHTML);
});

test('deserializing bullet list', () => {
  const serializer = new Html({
    rules: [blockRules, listItemRule, paragraphRule],
    parseHtml: fragment,
  });
  const deserialized = serializer.deserialize(
    '<ul><li>Rad 1</li><li>Rad 2</li><li>Rad 3</li></ul>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing bullet list', () => {
  const serializer = new Html({
    rules: [blockRules, listItemRule, paragraphRule],
    parseHtml: fragment,
  });
  const state = State.fromJSON(listState('bulleted-list'));
  const serialized = serializer.serialize(state);
  expect(serialized).toMatchSnapshot();
});

test('deserializing numbered list', () => {
  const serializer = new Html({
    rules: [blockRules, orderListRules, listItemRule, paragraphRule],
    parseHtml: fragment,
  });
  const deserialized = serializer.deserialize(
    '<ol><li>Rad 1</li><li>Rad 2</li><li>Rad 3</li></ol>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing numbered list', () => {
  const serializer = new Html({
    rules: [blockRules, orderListRules, listItemRule, paragraphRule],
    parseHtml: fragment,
  });
  const state = State.fromJSON(listState('numbered-list'));
  const serialized = serializer.serialize(state);
  expect(serialized).toMatchSnapshot();
});

test('deserializing alphabetical list', () => {
  const serializer = new Html({
    rules: [orderListRules, blockRules, listItemRule, paragraphRule],
    parseHtml: fragment,
  });
  const deserialized = serializer.deserialize(
    '<ol data-type="letters"><li>Rad 1</li><li>Rad 2</li><li>Rad 3</li></ol>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing letter list', () => {
  const serializer = new Html({
    rules: [orderListRules, blockRules, listItemRule, paragraphRule],
    parseHtml: fragment,
  });
  const state = State.fromJSON(listState('letter-list'));
  const serialized = serializer.serialize(state);
  expect(serialized).toMatchSnapshot();
});

test('deserializing list with paragraph inside li elements', () => {
  const serializer = new Html({
    rules: [blockRules, orderListRules, listItemRule, paragraphRule],
    parseHtml: fragment,
  });
  const listWithParagraphs =
    '<ul><li><p>paragraph 1</p></li><li><p>paragraph 2</p></li><li><p><strong>bold paragraph 3</strong></p></li></ul>';
  const deserialized = serializer.deserialize(listWithParagraphs);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing details box with summary element', () => {
  const serializer = new Html({
    rules: [blockRules],
    parseHtml: fragment,
  });
  const state = State.fromJSON(detailsBoxState);
  const serialized = serializer.serialize(state);
  expect(serialized).toMatchSnapshot();
});

test('deserializing details box with summary element', () => {
  const serializer = new Html({
    rules: [blockRules, paragraphRule],
    parseHtml: fragment,
  });
  const detailsWithSummary =
    '<details><summary>Summary text</summary><p>Details text</p></details>';
  const deserialized = serializer.deserialize(detailsWithSummary);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('deserializing a section', () => {
  const serializer = new Html({
    rules: [blockRules, paragraphRule],
    parseHtml: fragment,
  });
  const section = '<section><p>Paragraph text</p></sectiob>';
  const deserialized = serializer.deserialize(section);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing section', () => {
  const serializer = new Html({
    rules: [blockRules, paragraphRule],
    parseHtml: fragment,
  });
  const state = State.fromJSON(sectionState);
  const serialized = serializer.serialize(state);
  expect(serialized).toMatchSnapshot();
});

test('deserializing any heading should result in heading-two', () => {
  const serializer = new Html({
    rules: [blockRules, paragraphRule],
    parseHtml: fragment,
  });
  const h1 = '<h1>Heading 1</h1>';
  const h2 = '<h2>Heading 2</h2>';
  const h3 = '<h3>Heading 3</h3>';
  const h4 = '<h4>Heading 4</h4>';
  const h5 = '<h5>Heading 5</h5>';
  const h6 = '<h6>Heading 6</h6>';

  const deserializedH1 = serializer.deserialize(h1);
  const deserializedH2 = serializer.deserialize(h2);
  const deserializedH3 = serializer.deserialize(h3);
  const deserializedH4 = serializer.deserialize(h4);
  const deserializedH5 = serializer.deserialize(h5);
  const deserializedH6 = serializer.deserialize(h6);

  expect(toJSON(deserializedH1)).toMatchSnapshot();
  expect(toJSON(deserializedH2)).toMatchSnapshot();
  expect(toJSON(deserializedH3)).toMatchSnapshot();
  expect(toJSON(deserializedH4)).toMatchSnapshot();
  expect(toJSON(deserializedH5)).toMatchSnapshot();
  expect(toJSON(deserializedH6)).toMatchSnapshot();
});

test('serializing heading-two', () => {
  const serializer = new Html({
    rules: [blockRules],
    parseHtml: fragment,
  });
  const state = State.fromJSON(headingTwoState);
  const serialized = serializer.serialize(state);
  expect(serialized).toMatchSnapshot();
});

test('deserializing a quote', () => {
  const serializer = new Html({
    rules: [blockRules],
    parseHtml: fragment,
  });
  const quote =
    '<blockquote>This quote should be both smart and wise</blockquote>';
  const deserialized = serializer.deserialize(quote);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing quote', () => {
  const serializer = new Html({
    rules: [blockRules],
    parseHtml: fragment,
  });
  const state = State.fromJSON(quoteState);
  const serialized = serializer.serialize(state);
  expect(serialized).toMatchSnapshot();
});

test('deserializing a br', () => {
  const serializer = new Html({
    rules: [blockRules, paragraphRule],
    parseHtml: fragment,
  });
  const br = '<br />';
  const deserialized = serializer.deserialize(br);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing br', () => {
  const serializer = new Html({
    rules: [blockRules],
    parseHtml: fragment,
  });
  const state = State.fromJSON(brState);
  const serialized = serializer.serialize(state);
  expect(serialized).toMatchSnapshot();
});

test('deserialize standard article', () => {
  const serializer = new Html({
    rules: learningResourceRules,
    parseHtml: fragment,
  });
  const deserialized = serializer.deserialize(standardArticleHTML);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing standard article', () => {
  const serializer = new Html({
    rules: learningResourceRules,
    parseHtml: fragment,
  });
  const state = State.fromJSON(standardArticleState);
  const serialized = serializer.serialize(state);
  expect(serialized).toMatchSnapshot();
});
