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
  search => search.totalSearchResults,
);

export const getSearching = createSelector(
  [getSearchFromState],
  search => search.searching,
);

export const getTotalResultsCount = createSelector(
  [getSearchFromState],
  search => search.totalSearchResults.totalCount,
);

export const getLastPage = createSelector(
  [getSearchFromState, getTotalResultsCount],
  (search, totalResultsCount) => {
    const largestPageSize = search.totalSearchResults.pageSize;
    return totalResultsCount
      ? Math.ceil(totalResultsCount / largestPageSize)
      : 1;
  },
);

export const getAudioTotalResultsCount = createSelector(
  [getSearchFromState],
  search => search.totalAudioResults.totalCount,
);

export const getImageTotalResultsCount = createSelector(
  [getSearchFromState],
  search => search.totalImageResults.totalCount,
);

export const getAudioLastPage = createSelector(
  [getSearchFromState, getAudioTotalResultsCount],
  (search, totalResultsCount) => {
    const largestPageSize = search.totalAudioResults.pageSize;
    return totalResultsCount
      ? Math.ceil(totalResultsCount / largestPageSize)
      : 1;
  },
);

export const getImageLastPage = createSelector(
  [getSearchFromState, getImageTotalResultsCount],
  (search, totalResultsCount) => {
    const largestPageSize = search.totalImageResults.pageSize;
    return totalResultsCount
      ? Math.ceil(totalResultsCount / largestPageSize)
      : 1;
  },
);

export const getAudioResults = createSelector(
  [getSearchFromState],
  search => search.totalAudioResults,
);

export const getImageResults = createSelector(
  [getSearchFromState],
  search => search.totalImageResults,
);
