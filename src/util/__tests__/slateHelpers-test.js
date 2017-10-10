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
} from '../slateHelpers';

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
    rules: [blockRules],
    parseHtml: fragment,
  });
  const deserialized = serializer.deserialize(
    '<ul><li>Rad 1</li><li>Rad 2</li><li>Rad 3</li></ul>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('deserializing numbered list', () => {
  const serializer = new Html({
    rules: [blockRules, orderListRules],
    parseHtml: fragment,
  });
  const deserialized = serializer.deserialize(
    '<ol><li>Rad 1</li><li>Rad 2</li><li>Rad 3</li></ol>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('deserializing alphabetical list', () => {
  const serializer = new Html({
    rules: [blockRules, orderListRules],
    parseHtml: fragment,
  });
  const deserialized = serializer.deserialize(
    '<ol data-type="letters"><li>Rad 1</li><li>Rad 2</li><li>Rad 3</li></ol>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});
