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

export const fetchTags = createAction('FETCH_TAGS');
export const setTags = createAction('SET_TAGS');

export const actions = {
  fetchTags,
  setTags,
};

const initalState = {
  all: {},
};

export default handleActions(
  {
    [setTags]: {
      next: (state, action) => ({
        ...state,
        all: {
          [action.payload.language]: {
            hasFetched: true,
            ...action.payload,
          },
        },
      }),
      throw: state => state,
    },
  },
  initalState,
);

const getTagsFromState = state => state.tags.all;

export const getAllTagsByLanguage = language =>
  createSelector(
    [getTagsFromState],
    tags => {
      const languageTags = defined(tags[language], {});
      return defined(languageTags.tags, []);
    },
  );

export const getHasFetched = (state, language) =>
  state.tags.all[language] ? state.tags.all[language].hasFetched : false;
