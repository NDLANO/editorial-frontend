/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getAllTags, getHasFetched } from '../tagDucks';
import mockTags from './mockTags';

const state = {
  locale: 'zh',
  tags: {
    hasFetched: true,
    all: mockTags,
  },
};

test('tagSelector getAllTags with chinese locale', () => {
  expect(getAllTags(state).length).toBe(4);
});


test('tagSelector getAllTags with newnorwegian locale', () => {
  const updatedState = { ...state, locale: 'nn' };
  expect(getAllTags(updatedState).length).toBe(4);
});

test('tagSelector getAllTags with unknown locale', () => {
  const updatedState = { ...state, locale: 'nbsdjf' };
  expect(getAllTags(updatedState).length).toBe(0);
});

test('tagSelector getHasFetched', () => {
  expect(getHasFetched(state)).toBe(true);
});
