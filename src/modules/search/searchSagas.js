/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put } from 'redux-saga/effects';

import * as actions from './search';
import * as searchApi from './searchApi';
import * as imageApi from '../image/imageApi';

export function* search(query, type) {
  try {
    let searchResult;
    if (type === 'concept') {
      searchResult = yield call(searchApi.searchConcepts, query);
    } else {
      searchResult = yield call(searchApi.search, query);
    }
    yield put(actions.setSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    // TODO: handle error
    console.error(error); // eslint-disable-line no-console
  }
}

export function* watchSearch() {
  while (true) {
    const {
      payload: { query, type },
    } = yield take(actions.search);
    yield call(search, query, type);
  }
}

export function* searchAudio(query) {
  try {
    const searchResult = yield call(searchApi.searchAudio, query);
    yield put(actions.setAudioSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    // TODO: handle error
    console.error(error); // eslint-disable-line no-console
  }
}

export function* searchImage(query) {
  try {
    const searchResult = yield call(imageApi.searchImages, query);
    yield put(actions.setImageSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    // TODO: handle error
    console.error(error); // eslint-disable-line no-console
  }
}

export function* watchSearchAudio() {
  while (true) {
    const {
      payload: { query },
    } = yield take(actions.searchAudio);
    yield call(searchAudio, query);
  }
}

export function* watchSearchImage() {
  while (true) {
    const {
      payload: { query },
    } = yield take(actions.searchImage);
    yield call(searchImage, query);
  }
}

export default [watchSearch, watchSearchAudio, watchSearchImage];
