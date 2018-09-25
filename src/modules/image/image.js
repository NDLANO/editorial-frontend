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
export const clearUploadedImage = createAction('CLEAR_UPLOADED_IMAGE');

export const actions = {
  updateImage,
  fetchImage,
  setImage,
  updateImageSuccess,
  updateImageError,
  clearUploadedImage,
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
      next: (state, action) => ({
        ...state,
        isSaving: false,
        uploadedImage: action.payload.uploadedImage,
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
    [clearUploadedImage]: {
      next: state => ({
        ...state,
        uploadedImage: null,
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
    const imageLanguage =
      image &&
      useLanguage &&
      image.supportedLanguages &&
      image.supportedLanguages.includes(image.language)
        ? image.language
        : undefined;
    return image
      ? {
          ...image,
          id: parseInt(image.id, 10),
          title: convertFieldWithFallback(image, 'title', '', imageLanguage),
          tags: convertFieldWithFallback(image, 'tags', [], imageLanguage),
          alttext: convertFieldWithFallback(
            image,
            'alttext',
            '',
            imageLanguage,
          ),
          caption: convertFieldWithFallback(
            image,
            'caption',
            '',
            imageLanguage,
          ),
        }
      : undefined;
  });

export const getSaving = createSelector(
  [getImagesFromState],
  images => images.isSaving,
);

export const getUploadedImage = createSelector(
  [getImagesFromState],
  images => images.uploadedImage,
);
