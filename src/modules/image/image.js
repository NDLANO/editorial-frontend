/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';

import { createSelector } from 'reselect';
import { getLocale } from '../locale/locale';

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
  createSelector(
    [getImagesFromState],
    images => images.all[imageId.toString()],
  );

export const getImage = (imageId, useLanguage) =>
  createSelector(
    [getImageById(imageId), getLocale],
    (image, language) => image
        ? {
            ...image,
            title: image.title.title,
            tags: image.tags.tags,
            alttext: image.alttext.alttext,
            caption: image.caption.caption,
            language,
          }
        : undefined
  );

export const getSaving = createSelector(
  [getImagesFromState],
  images => images.isSaving,
);
