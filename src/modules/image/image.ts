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
import { ReduxState } from '../../interfaces';

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

export interface ReduxImageState {
  all: any;
  isSaving: boolean;
  images?: any;
  uploadedImage?: any;
}

const initialState: ReduxImageState = {
  all: {},
  isSaving: false,
};

export default handleActions(
  {
    SET_IMAGE: {
      next: (state: ReduxImageState, action: any) => {
        return {
          ...state,
          all: { ...state.all, [action.payload.id]: { ...action.payload } },
        };
      },
      throw: (state: ReduxImageState) => state,
    },
    UPDATE_IMAGE: {
      next: (state: ReduxImageState) => ({
        ...state,
        isSaving: true,
      }),
      throw: (state: ReduxImageState) => state,
    },
    UPDATE_IMAGE_SUCCESS: {
      next: (state: ReduxImageState, action: any) => ({
        ...state,
        isSaving: false,
        uploadedImage: action?.payload?.uploadedImage,
      }),
      throw: (state: ReduxImageState) => state,
    },
    UPDATE_IMAGE_ERROR: {
      next: (state: ReduxImageState) => ({
        ...state,
        isSaving: false,
      }),
      throw: (state: ReduxImageState) => state,
    },
    CLEAR_UPLOADED_IMAGE: {
      next: (state: ReduxImageState) => {
        return {
          ...state,
          uploadedImage: null,
        };
      },
      throw: (state: ReduxImageState) => state,
    },
  },
  initialState,
);

const getImagesFromState = (state: ReduxState): ReduxImageState => {
  return state.images;
};

export const getImageById = (imageId: string) => {
  return createSelector(getImagesFromState, (images: ReduxImageState) => images.all[imageId]);
};

export const getImage = (imageId: string, useLanguage: boolean = false) =>
  createSelector(getImageById(imageId), image => {
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
          alttext: convertFieldWithFallback(image, 'alttext', '', imageLanguage),
          caption: convertFieldWithFallback(image, 'caption', '', imageLanguage),
        }
      : undefined;
  });

export const getSaving = createSelector(getImagesFromState, images => images.isSaving);

export const getUploadedImage = createSelector(getImagesFromState, images => images.uploadedImage);
