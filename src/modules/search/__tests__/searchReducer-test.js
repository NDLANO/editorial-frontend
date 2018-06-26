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
  setDraftSearchResult,
  clearSearchResult,
} from '../search';
import { contentResults, mediaResults } from './_mockSearchResult';

test('reducers/search initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    totalSearchResults: { results: [] },
    totalDraftResults: { results: [] },
    searching: false,
  });
});

test('reducers/search search', () => {
  const nextState = reducer(undefined, search());

  expect(nextState).toEqual({
    searching: true,
    totalSearchResults: { results: [] },
    totalDraftResults: { results: [] },
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
    payload: contentResults,
  });

  expect(nextState.totalSearchResults.totalCount).toBe(40);
  expect(nextState.totalSearchResults.results.length).toBe(2);
  expect(nextState.totalSearchResults.page).toBe(1);
  expect(nextState.totalSearchResults.pageSize).toBe(10);
  expect(nextState.totalSearchResults.language).toBe('all');
  expect(nextState.searching).toBe(false);
});

test('reducers/search handle set searchDraft result', () => {
  const nextState = reducer(initalState, {
    type: setDraftSearchResult,
    payload: mediaResults,
  });

  expect(nextState.totalDraftResults[0].totalCount).toBe(32);
  expect(nextState.totalDraftResults[0].results.length).toBe(2);
  expect(nextState.totalDraftResults[0].page).toBe(3);
  expect(nextState.totalDraftResults[0].pageSize).toBe(2);
  expect(nextState.totalDraftResults[0].language).toBe('all');
  expect(nextState.searching).toBe(false);
});

test('reducers/search handle clear search result', () => {
  const nextState = reducer(contentResults, {
    type: clearSearchResult,
  });

  expect(nextState).toEqual(initalState);
});

test('reducers/search handle clear searchDraft result', () => {
  const nextState = reducer(mediaResults, {
    type: clearSearchResult,
  });

  expect(nextState).toEqual(initalState);
});
