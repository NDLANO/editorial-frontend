/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  getResults,
  getLastPage,
  getAudioResults,
  getImageResults,
  getAudioLastPage,
  getConceptResults,
  getImageLastPage,
  getConceptLastPage,
} from '../searchSelectors';
import { contentResults, audioResults, conceptResults, imageResults } from './_mockSearchResult';

const lastPageTestState = {
  search: {
    searching: false,
    totalSearchResults: {
      totalCount: 30,
      pageSize: 3,
      results: [],
    },
    totalAudioResults: {
      totalCount: 27,
      pageSize: 3,
      results: [],
    },
    totalConceptResults: {
      totalCount: 21,
      pageSize: 3,
      results: [],
    },
    totalImageResults: {
      totalCount: 24,
      pageSize: 3,
      results: [],
    },
  },
};

test('searchSelectors getResults', () => {
  const state = {
    search: { totalSearchResults: contentResults },
  };
  expect(getResults(state)).toMatchSnapshot();
});

test('searchSelectors getLastPage', () => {
  expect(getLastPage(lastPageTestState)).toBe(10);
});

test('searchSelectors getAudioResults', () => {
  const state = {
    search: { totalAudioResults: audioResults },
  };

  expect(getAudioResults(state)).toMatchSnapshot();
});

test('searchSelectors getConceptResults', () => {
  const state = {
    search: { totalConceptResults: conceptResults },
  };

  expect(getConceptResults(state)).toMatchSnapshot();
});

test('searchSelectors getImageResults', () => {
  const state = {
    search: { totalImageResults: imageResults },
  };

  expect(getImageResults(state)).toMatchSnapshot();
});

test('searchSelectors getAudioLastPage', () => {
  expect(getAudioLastPage(lastPageTestState)).toBe(9);
});

test('searchSelectors getConceptLastPage', () => {
  expect(getConceptLastPage(lastPageTestState)).toBe(7);
});

test('searchSelectors getImageLastPage', () => {
  expect(getImageLastPage(lastPageTestState)).toBe(8);
});
