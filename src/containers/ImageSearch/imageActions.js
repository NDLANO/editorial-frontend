/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';

export const searchImages = createAction('SEARCH_IMAGES');
export const searchImagesError = createAction('SEARCH_IMAGES_ERROR');
export const setImageSearchResult = createAction('SET_IMAGE_SEARCH_RESULT');
export const fetchSelectedImage = createAction('FETCH_SELECTED_IMAGE');
export const setSelectedImage = createAction('SET_SELECTED_IMAGE');
