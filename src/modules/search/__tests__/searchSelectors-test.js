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
  getImageLastPage,
} from '../searchSelectors';
import {
  contentResults,
  audioResults,
  imageResults,
} from './_mockSearchResult';

const lastPageTestState = {
  search: {
    searching: false,
    totalSearchResults: {
      totalCount: 30,
      pageSize: 3,
      results: [],
    },
    totalMediaResults: {
      totalCount: 30,
      pageSize: 3,
      results: [],
    },
  },
};

const lastPageTestAudioState = {
  search: {
    searching: false,
    totalAudioResults: {
      results: [
        {
          totalCount: 3,
          pageSize: 3,
        },
        {
          totalCount: 30,
          pageSize: 3,
        },
      ],
    },
  },
};

const lastPageTestImageState = {
  search: {
    searching: false,
    totalImageResults: {
      results: [
        {
          totalCount: 3,
          pageSize: 3,
        },
        {
          totalCount: 30,
          pageSize: 3,
        },
      ],
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
    search: { totalAudioResults: { results: audioResults } },
  };

  expect(getAudioResults(state)).toMatchSnapshot();
});

test('searchSelectors getImageResults', () => {
  const state = {
    search: { totalImageResults: { results: imageResults } },
  };

  expect(getImageResults(state)).toMatchSnapshot();
});

test('searchSelectors getAudioLastPage', () => {
  expect(getAudioLastPage(lastPageTestAudioState)).toBe(11);
});

test('searchSelectors getImageLastPage', () => {
  expect(getImageLastPage(lastPageTestImageState)).toBe(11);
});
