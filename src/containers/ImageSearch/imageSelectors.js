/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import { getLocale } from '../../modules/locale/locale';
import { tagsI18N } from '../../util/i18nFieldFinder';

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
  search => Math.ceil(search.totalCount / search.pageSize) || 1,
);

export const getTotalCount = createSelector(
  [getImageSearchFromState],
  search => search.totalCount,
);

export const getSelectedImage = createSelector(
  [getImageSearchFromState, getLocale],
  (search, lang) =>
    search.selectedImage
      ? {
          ...search.selectedImage,
          tags: search.selectedImage
            ? tagsI18N(search.selectedImage, lang)
            : [],
        }
      : undefined,
);

export const getQueryObject = createSelector(
  [getImageSearchFromState],
  search => ({
    query: search.query,
    page: search.page,
  }),
);
