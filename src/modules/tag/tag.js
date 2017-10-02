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

import { getLocale } from '../locale/locale';

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

export default handleActions(
  {
    [setTags]: {
      next: (state, action) => ({
        ...state,
        all: action.payload,
        hasFetched: true,
      }),
      throw: state => state,
    },
  },
  initalState,
);

const getTagsFromState = state => state.tags.all;

const getLanuage = (state, language) => language;

export const getAllTags = createSelector(
  [getTagsFromState, getLocale, getLanuage],
  (tags, locale, lang) => {
    const l = lang || locale;
    const language = defined(tags.find(tag => tag.language === l), {});
    return defined(language.tags, []);
  },
);

export const getHasFetched = state => state.tags.hasFetched;
