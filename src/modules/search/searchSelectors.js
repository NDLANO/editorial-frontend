/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';

const getSearchFromState = state => state.search;

export const getResults = createSelector(
  [getSearchFromState],
  search => search.totalResults,
);

export const getSearching = createSelector(
  [getSearchFromState],
  search => search.searching,
);

export const getLastPage = createSelector([getSearchFromState], search => {
  const totalResultsCount = search.totalResults
    .map(t => t.totalCount)
    .reduce((a, b) => a + b, 0);
  const largestPageSize = search.totalResults
    .map(t => t.totalCount)
    .reduce((a, b) => Math.max(a, b), 1);
  return totalResultsCount ? Math.ceil(totalResultsCount / largestPageSize) : 1;
});
