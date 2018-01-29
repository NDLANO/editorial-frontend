/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';

import { createSelector } from 'reselect';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';

export const fetchAudio = createAction('FETCH_AUDIO');
export const setAudio = createAction('SET_AUDIO');
export const updateAudio = createAction('UPDATE_AUDIO');
export const updateAudioSuccess = createAction('UPDATE_AUDIO_SUCCESS');
export const updateAudioError = createAction('UPDATE_AUDIO_ERROR');

export const actions = {
  updateAudio,
  fetchAudio,
  setAudio,
  updateAudioSuccess,
  updateAudioError,
};

const initalState = {
  all: {},
  isSaving: false,
};

export default handleActions(
  {
    [setAudio]: {
      next: (state, action) => ({
        ...state,
        all: { ...state.all, [action.payload.id]: { ...action.payload } },
      }),
      throw: state => state,
    },
    [updateAudio]: {
      next: state => ({
        ...state,
        isSaving: true,
      }),
      throw: state => state,
    },
    [updateAudioSuccess]: {
      next: state => ({
        ...state,
        isSaving: false,
      }),
      throw: state => state,
    },
    [updateAudioError]: {
      next: state => ({
        ...state,
        isSaving: false,
      }),
      throw: state => state,
    },
  },
  initalState,
);

const getAudiosFromState = state => state.audios;

export const getAudioById = audioId =>
  createSelector(
    [getAudiosFromState],
    audios => audios.all[audioId.toString()],
  );

export const getAudio = (audioId, useLanguage = false) =>
  createSelector([getAudioById(audioId)], audio => {
    const audioLanguage = audio && useLanguage ? audio.language : undefined;
    const isSupportedLanguage =
      audio && audio.supportedLanguages
        ? audio.supportedLanguages.includes(audioLanguage)
        : false;

    return audio
      ? {
          ...audio,
          title: isSupportedLanguage
            ? convertFieldWithFallback(audio, 'title', '', audioLanguage)
            : audio.title.title,
          tags: isSupportedLanguage
            ? convertFieldWithFallback(audio, 'tags', [], audioLanguage)
            : audio.title.title,
        }
      : undefined;
  });

export const getSaving = createSelector(
  [getAudiosFromState],
  audios => audios.isSaving,
);
