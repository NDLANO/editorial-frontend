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
    totalResults: [
      {
        totalCount: 3,
        pageSize: 3,
      },
    ],
  },
};

test('searchSelectors getResults', () => {
  const state = {
    search,
  };

  expect(getResults(state)).toMatchSnapshot();
});

test('searchSelectors getLastPage', () => {
  expect(getLastPage(lastPageTestState)).toBe(1);
  //  expect(getLastPage(lastPageTestState(1, 10))).toBe(1);
  // expect(getLastPage(lastPageTestState(27, 10))).toBe(3);
  // expect(getLastPage(lastPageTestState(234, 10))).toBe(24);
  // expect(getLastPage(lastPageTestState(234, 100))).toBe(3);
});
