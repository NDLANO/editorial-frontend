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
import { Raw, Html } from 'slate';
import {
  stateWithInlineFootnotesAndContentLinks,
  stateWithTwoImageEmbeds,
} from './slateMockStates';
import footnotes from './mockFootnotes';
import {
  createFootnoteRule,
  learningResourceEmbedRule,
  findNodesByType,
  divRule,
  toJSON,
} from '../slateHelpers';
import { FootnoteCounter } from '../articleContentConverter';

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
  const document = Raw.deserialize(stateWithTwoImageEmbeds).document;
  const embeds = findNodesByType(document, 'embed');
  expect(embeds.length).toBe(2);
});

test('find footnote nodes in slate document', () => {
  const document = Raw.deserialize(stateWithInlineFootnotesAndContentLinks)
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
  const serializer = new Html({ rules: [divRule] });
  const deserialized = serializer.deserialize(
    '<div class="c-bodybox">test</div>',
  );

  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('deserialize footnote', () => {
  const serializer = new Html({
    rules: [createFootnoteRule(footnotes, new FootnoteCounter())],
  });
  const deserialized = serializer.deserialize(
    `
    <p>
      Lorem.<a href="#ref_1_cite" name="ref_1_sup"><sup>1</sup></a>
      Ipsum.<a href="#ref_2_cite" name="ref_2_sup"><sup>2</sup></a>
    </p>
    `,
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serialize footnote', () => {
  const obj = {
    isVoid: false,
    kind: 'inline',
    data: {
      authors: ['Jony Ive'],
      edition: '4',
      publisher: 'Apple',
      title: 'Apple Watch',
      type: '',
      year: '2015',
    },
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
  const serializer = createFootnoteRule(footnotes, new FootnoteCounter());
  const footnote1 = serializer.serialize(obj);
  expect(renderer.create(footnote1).toJSON()).toMatchSnapshot();

  // test that counter increases ref number
  const footnote2 = serializer.serialize(obj);
  expect(renderer.create(footnote2).toJSON()).toMatchSnapshot();
});
