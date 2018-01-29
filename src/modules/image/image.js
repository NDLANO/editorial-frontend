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

export const fetchImage = createAction('FETCH_IMAGE');
export const setImage = createAction('SET_IMAGE');
export const updateImage = createAction('UPDATE_IMAGE');
export const updateImageSuccess = createAction('UPDATE_IMAGE_SUCCESS');
export const updateImageError = createAction('UPDATE_IMAGE_ERROR');

export const actions = {
  updateImage,
  fetchImage,
  setImage,
  updateImageSuccess,
  updateImageError,
};

const initalState = {
  all: {},
  isSaving: false,
};

export default handleActions(
  {
    [setImage]: {
      next: (state, action) => ({
        ...state,
        all: { ...state.all, [action.payload.id]: { ...action.payload } },
      }),
      throw: state => state,
    },
    [updateImage]: {
      next: state => ({
        ...state,
        isSaving: true,
      }),
      throw: state => state,
    },
    [updateImageSuccess]: {
      next: state => ({
        ...state,
        isSaving: false,
      }),
      throw: state => state,
    },
    [updateImageError]: {
      next: state => ({
        ...state,
        isSaving: false,
      }),
      throw: state => state,
    },
  },
  initalState,
);

const getImagesFromState = state => state.images;

export const getImageById = imageId =>
  createSelector([getImagesFromState], images => images.all[imageId]);

export const getImage = (imageId, useLanguage = false) =>
  createSelector([getImageById(imageId)], image => {
    const imageLanguage = image && useLanguage ? image.language : undefined;

    const isSupportedLanguage =
      image && image.supportedLanguages
        ? image.supportedLanguages.includes(imageLanguage)
        : false;
    return image
      ? {
          ...image,
          title: isSupportedLanguage
            ? convertFieldWithFallback(image, 'title', '', imageLanguage)
            : image.title.title,
          tags: isSupportedLanguage
            ? convertFieldWithFallback(image, 'tags', [], imageLanguage)
            : image.title.tags,
          alttext: isSupportedLanguage
            ? convertFieldWithFallback(image, 'alttext', '', imageLanguage)
            : image.title.alttext,
          caption: isSupportedLanguage
            ? convertFieldWithFallback(image, 'caption', '', imageLanguage)
            : image.title.caption,
        }
      : undefined;
  });

export const getSaving = createSelector(
  [getImagesFromState],
  images => images.isSaving,
);
