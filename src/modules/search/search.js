/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';

export const search = createAction('SEARCH');
export const searchAudio = createAction('SEARCH_AUDIO');
export const searchConcept = createAction('SEARCH_CONCEPT');
export const searchImage = createAction('SEARCH_IMAGE');
export const searchPodcastSeries = createAction('SEARCH_PODCAST_SERIES');
export const searchError = createAction('SEARCH_ERROR');
export const clearSearchResult = createAction('CLEAR_SEARCH_RESULT');
export const setSearchResult = createAction('SET_SEARCH_RESULT');
export const setAudioSearchResult = createAction('SET_AUDIO_SEARCH_RESULT');
export const setPodcastSeriesSearchResult = createAction('SET_PODCAST_SERIES_SEARCH_RESULT');
export const setConceptSearchResult = createAction('SET_CONCEPT_SEARCH_RESULT');
export const setImageSearchResult = createAction('SET_IMAGE_SEARCH_RESULT');

export const initalState = {
  totalSearchResults: { results: [] },
  totalAudioResults: { results: [] },
  totalConceptResults: { results: [] },
  totalImageResults: { results: [] },
  totalPodcastSeriesResults: { results: [] },
  searching: false,
};

export default handleActions(
  {
    [search]: {
      next: state => ({ ...state, searching: true }),
      throw: state => state,
    },
    [searchAudio]: {
      next: state => ({ ...state, searching: true }),
      throw: state => state,
    },
    [searchConcept]: {
      next: state => ({ ...state, searching: true }),
      throw: state => state,
    },
    [searchImage]: {
      next: state => ({ ...state, searching: true }),
      throw: state => state,
    },
    [searchPodcastSeries]: {
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
    [setAudioSearchResult]: {
      next: (state, action) => ({
        ...state,
        totalAudioResults: action.payload,
        searching: false,
      }),
      throw: state => state,
    },
    [setConceptSearchResult]: {
      next: (state, action) => ({
        ...state,
        totalConceptResults: action.payload,
        searching: false,
      }),
      throw: state => state,
    },
    [setImageSearchResult]: {
      next: (state, action) => ({
        ...state,
        totalImageResults: action.payload,
        searching: false,
      }),
      throw: state => state,
    },
    [setPodcastSeriesSearchResult]: {
      next: (state, action) => ({
        ...state,
        totalPodcastSeriesResults: action.payload,
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
