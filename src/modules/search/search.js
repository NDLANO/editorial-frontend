/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';

export const search = createAction('SEARCH');
export const searchDraft = createAction('SEARCH_DRAFT');
export const searchError = createAction('SEARCH_ERROR');
export const clearSearchResult = createAction('CLEAR_SEARCH_RESULT');
export const setSearchResult = createAction('SET_SEARCH_RESULT');
export const setDraftSearchResult = createAction('SET_DRAFT_SEARCH_RESULT');

export const initalState = {
  totalSearchResults: { results: [] },
  totalDraftResults: { results: [] },
  searching: false,
};

export default handleActions(
  {
    [search]: {
      next: state => ({ ...state, searching: true }),
      throw: state => state,
    },
    [searchDraft]: {
      next: state => ({ ...state, searching: true }),
      throw: state => state,
    },
    [setSearchResult]: {
      next: (state, action) => ({
        ...state,
        totalSearchResults: action.payload,
        searching: false,
      }),
      throw: state => state,
    },
    [setDraftSearchResult]: {
      next: (state, action) => ({
        ...state,
        totalDraftResults: action.payload,
        searching: false,
      }),
      throw: state => state,
    },
    [clearSearchResult]: {
      next: () => initalState,
      throw: state => state,
    },
    [searchError]: {
      next: state => ({ ...state, searching: false }),
      throw: state => state,
    },
  },
  initalState,
);
