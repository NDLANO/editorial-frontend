/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import { handleActions } from 'redux-actions';
import * as actions from './imageActions';

const initialState = {
  results: [],
  searching: false,
  selectedImage: {},
  query: '',
  page: 1,
  pageSize: 16,
};

export default handleActions({
  [actions.searchImages]: {
    next(state, action) {
      return { ...state, query: action.payload, searching: true };
    },
    throw(state) { return state; },
  },
  [actions.setImageSearchResult]: {
    next(state, action) {
      return { ...state, ...action.payload, searching: false };
    },
    throw(state) { return state; },
  },
  [actions.searchImagesError]: {
    next(state) {
      return { ...state, searching: false };
    },
    throw(state) { return state; },
  },
  [actions.setSelectedImage]: {
    next(state, action) {
      return { ...state, selectedImage: action.payload };
    },
    throw(state) { return state; },
  },
}, initialState);
