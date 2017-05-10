/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { initalState } from '../imageReducer';
import * as actions from '../imageActions';
import searchResult from './mockImageSearchResult';

test('reducers/image initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    results: [],
    searching: false,
    selectedImage: {},
    query: '',
    page: 1,
    pageSize: 16,
  });
});

test('reducers/image search', () => {
  const nextState = reducer(undefined, actions.searchImages('17. mai'));

  expect(nextState).toEqual({
    results: [],
    searching: true,
    selectedImage: {},
    query: '17. mai',
    page: 1,
    pageSize: 16,
  });
});

test('reducers/image searchError', () => {
  const state = { ...initalState, searching: true };
  const nextState = reducer(state, actions.searchImagesError());
  expect(nextState.searching).toBe(false);
});


test('reducers/image handle set search result', () => {
  const nextState = reducer(initalState, {
    type: actions.setImageSearchResult,
    payload: searchResult,
  });

  expect(nextState.totalCount).toBe(36);
  expect(nextState.results.length).toBe(16);
  expect(nextState.page).toBe(3);
  expect(nextState.pageSize).toBe(16);
  expect(nextState.searching).toBe(false);
});
