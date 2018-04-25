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
  search => search.results,
);

export const getSearching = createSelector(
  [getSearchFromState],
  search => search.searching,
);

export const getTotalResultsCount = createSelector(
  [getSearchFromState],
  search => search.results.totalCount,
);

export const getLastPage = createSelector(
  [getSearchFromState, getTotalResultsCount],
  (search, totalResultsCount) => {
    const largestPageSize = search.results.pageSize;
    return totalResultsCount
      ? Math.ceil(totalResultsCount / largestPageSize)
      : 1;
  },
);

export const getDraftResults = createSelector([getSearchFromState], search => {
  const results = [];
  search.results.forEach(allResult =>
    results.push(
      ...allResult.results.map(result => ({ ...result, type: allResult.type })),
    ),
  );
  return results;
});

export const getDraftTotalResultsCount = createSelector(
  [getSearchFromState],
  searchDraft =>
    searchDraft.results.map(t => t.totalCount).reduce((a, b) => a + b, 0),
);

export const getDraftLastPage = createSelector(
  [getSearchFromState, getDraftTotalResultsCount],
  (search, totalResultsCount) => {
    const largestPageSize = search.results
      .map(t => t.pageSize)
      .reduce((a, b) => Math.max(a, b), 1);
    return totalResultsCount
      ? Math.ceil(totalResultsCount / largestPageSize)
      : 1;
  },
);
