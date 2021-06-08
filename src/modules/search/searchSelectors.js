/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';

const getSearchFromState = state => state.search;

export const getResults = createSelector([getSearchFromState], search => search.totalSearchResults);

export const getSearching = createSelector([getSearchFromState], search => search.searching);

export const getTotalResultsCount = createSelector(
  [getSearchFromState],
  search => search.totalSearchResults.totalCount,
);

export const getLastPage = createSelector(
  [getSearchFromState, getTotalResultsCount],
  (search, totalResultsCount) => {
    const largestPageSize = search.totalSearchResults.pageSize;
    return totalResultsCount ? Math.ceil(totalResultsCount / largestPageSize) : 1;
  },
);

export const getAudioTotalResultsCount = createSelector(
  [getSearchFromState],
  search => search.totalAudioResults.totalCount,
);

export const getConceptTotalResultsCount = createSelector(
  [getSearchFromState],
  search => search.totalConceptResults.totalCount,
);

export const getImageTotalResultsCount = createSelector(
  [getSearchFromState],
  search => search.totalImageResults.totalCount,
);

export const getPodcastSeriesTotalResultsCount = createSelector(
  [getSearchFromState],
  search => search.totalPodcastSeriesResults.totalCount,
);

export const getAudioLastPage = createSelector(
  [getSearchFromState, getAudioTotalResultsCount],
  (search, totalResultsCount) => {
    const largestPageSize = search.totalAudioResults.pageSize;
    return totalResultsCount ? Math.ceil(totalResultsCount / largestPageSize) : 1;
  },
);

export const getConceptLastPage = createSelector(
  [getSearchFromState, getConceptTotalResultsCount],
  (search, totalResultsCount) => {
    const largestPageSize = search.totalConceptResults.pageSize;
    return totalResultsCount ? Math.ceil(totalResultsCount / largestPageSize) : 1;
  },
);

export const getImageLastPage = createSelector(
  [getSearchFromState, getImageTotalResultsCount],
  (search, totalResultsCount) => {
    const largestPageSize = search.totalImageResults.pageSize;
    return totalResultsCount ? Math.ceil(totalResultsCount / largestPageSize) : 1;
  },
);

export const getPodcastSeriesLastPage = createSelector(
  [getSearchFromState, getPodcastSeriesTotalResultsCount],
  (search, totalResultsCount) => {
    const largestPageSize = search.totalPodcastSeriesResults.pageSize;
    return totalResultsCount ? Math.ceil(totalResultsCount / largestPageSize) : 1;
  },
);

export const getAudioResults = createSelector(
  [getSearchFromState],
  search => search.totalAudioResults,
);

export const getConceptResults = createSelector(
  [getSearchFromState],
  search => search.totalConceptResults,
);

export const getImageResults = createSelector(
  [getSearchFromState],
  search => search.totalImageResults,
);

export const getPodcastSeriesResults = createSelector(
  [getSearchFromState],
  search => search.totalPodcastSeriesResults,
);
