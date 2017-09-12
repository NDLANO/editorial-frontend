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
import { stateWithTwoImageEmbeds } from './slateMockStates';
import {
  learningResourceEmbedRule,
  findEmbedNodes,
  divRule,
} from '../slateHelpers';

test('serialize embed block', () => {
  const obj = {
    kind: 'block',
    type: 'embed',
    data: fromJS({ caption: 'test' }),
  };
  const tag = learningResourceEmbedRule[0].serialize(obj);

  expect(renderer.create(tag).toJSON()).toMatchSnapshot();
});

test('findEmbedNodes in slate Document', () => {
  const document = Raw.deserialize(stateWithTwoImageEmbeds).document;
  const embeds = findEmbedNodes(document);
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
  const deseralized = serializer.deserialize(
    '<div class="c-bodybox">test</div>',
  );
  expect(deseralized).toMatchSnapshot();
});
