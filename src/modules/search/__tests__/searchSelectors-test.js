/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getResults, getLastPage } from '../searchSelectors';
import search from './_mockSearchResult';

const lastPageTestState = {
  search: {
    searching: false,
    totalResults: {
      totalCount: 30,
      pageSize: 3,
    },
  },
};

test('searchSelectors getResults', () => {
  const state = {
    search,
  };

  expect(getResults(state)).toMatchSnapshot();
});

test('searchSelectors getLastPage', () => {
  expect(getLastPage(lastPageTestState)).toBe(10);
});
