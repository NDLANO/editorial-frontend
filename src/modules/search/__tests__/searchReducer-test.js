/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, {
  initalState,
  search,
  searchError,
  setSearchResult,
  clearSearchResult,
} from '../search';
import searchResult from './_mockSearchResult';

test('reducers/search initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    totalResults: [],
    searching: false,
  });
});

test('reducers/search search', () => {
  const nextState = reducer(undefined, search());

  expect(nextState).toEqual({
    searching: true,
    totalResults: [
      {
        results: [],
        totalCount: 1,
        pageSize: 10,
      },
    ],
  });
});

test('reducers/search searchError', () => {
  const state = { ...initalState, searching: true };
  const nextState = reducer(state, searchError());
  expect(nextState.searching).toBe(false);
});

test('reducers/search handle set search result', () => {
  const nextState = reducer(initalState, {
    type: setSearchResult,
    payload: searchResult,
  });

  expect(nextState.totalCount).toBe(32);
  expect(nextState.results.length).toBe(2);
  expect(nextState.page).toBe(3);
  expect(nextState.pageSize).toBe(2);
  expect(nextState.searching).toBe(false);
});

test('reducers/search handle clear search result', () => {
  const nextState = reducer(searchResult, {
    type: clearSearchResult,
  });

  expect(nextState).toEqual(initalState);
});
