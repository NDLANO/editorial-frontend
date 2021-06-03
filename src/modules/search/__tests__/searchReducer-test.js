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
  setAudioSearchResult,
  setConceptSearchResult,
  setImageSearchResult,
  clearSearchResult,
} from '../search';
import { contentResults, audioResults, conceptResults, imageResults } from './_mockSearchResult';

test('reducers/search initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    totalSearchResults: { results: [] },
    totalAudioResults: { results: [] },
    totalConceptResults: { results: [] },
    totalImageResults: { results: [] },
    totalPodcastSeriesResults: { results: [] },
    searching: false,
  });
});

test('reducers/search search', () => {
  const nextState = reducer(undefined, search());

  expect(nextState).toEqual({
    searching: true,
    totalSearchResults: { results: [] },
    totalAudioResults: { results: [] },
    totalConceptResults: { results: [] },
    totalImageResults: { results: [] },
    totalPodcastSeriesResults: { results: [] },
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

test('reducers/search handle set searchAudio result', () => {
  const nextState = reducer(initalState, {
    type: setAudioSearchResult,
    payload: audioResults,
  });

  expect(nextState.totalAudioResults.totalCount).toBe(100);
  expect(nextState.totalAudioResults.results.length).toBe(2);
  expect(nextState.totalAudioResults.page).toBe(4);
  expect(nextState.totalAudioResults.pageSize).toBe(2);
  expect(nextState.totalAudioResults.language).toBe('all');
  expect(nextState.searching).toBe(false);
});

test('reducers/search handle set searchConcept result', () => {
  const nextState = reducer(initalState, {
    type: setConceptSearchResult,
    payload: conceptResults,
  });

  expect(nextState.totalConceptResults.totalCount).toBe(50);
  expect(nextState.totalConceptResults.results.length).toBe(2);
  expect(nextState.totalConceptResults.page).toBe(6);
  expect(nextState.totalConceptResults.pageSize).toBe(2);
  expect(nextState.totalConceptResults.language).toBe('all');
  expect(nextState.totalConceptResults.results[0].content.content).toBe('Test content');
  expect(nextState.totalConceptResults.results[0].id).toBe(1);
  expect(nextState.totalConceptResults.results[0].license).toBe('test license');
  expect(nextState.totalConceptResults.results[0].lastUpdated).toBe('2021-01-25T11:12:12Z');
  expect(nextState.totalConceptResults.results[0].metaImage.url).toBe('testurl');
  expect(nextState.totalConceptResults.results[0].status).toEqual({ current: 'DRAFT', other: [] });
  expect(nextState.totalConceptResults.results[0].subjectIds).toEqual(['urn:subject:1']);
  expect(nextState.totalConceptResults.results[0].supportedLanguages).toEqual(['nb']);
  expect(nextState.totalConceptResults.results[0].tags).toEqual({
    tags: ['test tag'],
    language: 'nb',
  });
  expect(nextState.totalConceptResults.results[0].title).toEqual({
    title: 'test title',
    language: 'nb',
  });
  expect(nextState.totalConceptResults.results[0].updatedBy).toEqual(['person1', 'person2']);
  expect(nextState.searching).toBe(false);
});

test('reducers/search handle set searchImage result', () => {
  const nextState = reducer(initalState, {
    type: setImageSearchResult,
    payload: imageResults,
  });

  expect(nextState.totalImageResults.totalCount).toBe(32);
  expect(nextState.totalImageResults.results.length).toBe(2);
  expect(nextState.totalImageResults.page).toBe(3);
  expect(nextState.totalImageResults.pageSize).toBe(2);
  expect(nextState.totalImageResults.language).toBe('all');
  expect(nextState.searching).toBe(false);
});

test('reducers/search handle clear search result', () => {
  const nextState = reducer(contentResults, {
    type: clearSearchResult,
  });

  expect(nextState).toEqual(initalState);
});

test('reducers/search handle clear searchAudio result', () => {
  const nextState = reducer(audioResults, {
    type: clearSearchResult,
  });

  expect(nextState).toEqual(initalState);
});

test('reducers/search handle clear searchImage result', () => {
  const nextState = reducer(imageResults, {
    type: clearSearchResult,
  });

  expect(nextState).toEqual(initalState);
});
