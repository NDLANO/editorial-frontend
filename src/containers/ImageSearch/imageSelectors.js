/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';

const getImageSearchFromState = state => state.imageSearch;

export const getResults = createSelector(
    [getImageSearchFromState],
    search => search.results,
);

export const getSearching = createSelector(
    [getImageSearchFromState],
    search => search.searching,
);

export const getLastPage = createSelector(
    [getImageSearchFromState],
    search => Math.ceil(search.totalCount / search.pageSize),
);
