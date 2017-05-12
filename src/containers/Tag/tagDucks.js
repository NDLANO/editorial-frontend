/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';
import { createSelector } from 'reselect';
import defined from 'defined';

import { getLocale } from '../Locale/localeSelectors';

export const fetchTags = createAction('FETCH_TAGS');
export const setTags = createAction('SET_TAGS');

export const actions = {
  fetchTags,
  setTags,
};

const initalState = {
  all: [],
  hasFetched: false,
};

export default handleActions({
  [setTags]: {
    next: (state, action) => ({ ...state, all: action.payload, hasFetched: true }),
    throw: state => state,
  },
}, initalState);

const getTagsFromState = state => state.tags.all;

export const getAllTags = createSelector(
  [getTagsFromState, getLocale],
  (tags, locale) => {
    const language = defined(tags.find(tag => tag.language === locale), {});
    return defined(language.tags, []);
  },
);

export const getHasFetched = state => state.tags.hasFetched;
