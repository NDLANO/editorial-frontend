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
  getDraftResults,
  getDraftLastPage,
} from '../searchSelectors';
import { contentResults, mediaResults } from './_mockSearchResult';

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

const lastPageTestMediaState = {
  search: {
    searching: false,
    totalDraftResults: {
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

test('searchSelectors getDraftResults', () => {
  const state = {
    search: { totalDraftResults: { results: mediaResults } },
  };

  expect(getDraftResults(state)).toMatchSnapshot();
});

test('searchSelectors getDraftLastPage', () => {
  expect(getDraftLastPage(lastPageTestMediaState)).toBe(11);
});
