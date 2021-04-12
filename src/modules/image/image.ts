/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction, Action } from 'redux-actions';

import { createSelector } from 'reselect';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { ReduxState } from '../../interfaces';
import { ImageApiType, UpdatedImageMetadata } from './imageApiInterfaces';

export const fetchImage = createAction('FETCH_IMAGE');
export const setImage = createAction<ImageApiTypeRedux>('SET_IMAGE');
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

export type ImageApiTypeRedux = ImageApiType & { language?: string };
export type FlatReduxImage = Omit<UpdatedImageMetadata, 'language'> & { language?: string };

export interface ReduxImageState {
  all: {
    [imageId: string]: ImageApiTypeRedux;
  };
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
      next: (state: ReduxImageState, action: Action<ImageApiTypeRedux>) => {
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
  createSelector(getImageById(imageId), (image: ImageApiTypeRedux): FlatReduxImage | undefined => {
    const imageLanguage =
      useLanguage && image?.language && image?.supportedLanguages?.includes(image.language)
        ? image.language
        : undefined;

    return image
      ? {
          ...image,
          id: Number(image.id),
          title: convertFieldWithFallback<'title'>(image, 'title', '', imageLanguage),
          tags: convertFieldWithFallback<'tags', string[]>(image, 'tags', [], imageLanguage),
          alttext: convertFieldWithFallback<'alttext'>(image, 'alttext', '', imageLanguage),
          caption: convertFieldWithFallback<'caption'>(image, 'caption', '', imageLanguage),
        }
      : undefined;
  });

export const getSaving = createSelector(getImagesFromState, images => images.isSaving);

export const getUploadedImage = createSelector(getImagesFromState, images => images.uploadedImage);
