/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';

import { getLocale } from '../Locale/localeSelectors';
import { getAccessToken } from '../App/sessionSelectors';
import * as actions from './imageActions';
import * as api from './imageApi';

export function* search(query, page) {
  try {
    const locale = yield select(getLocale);
    const token = yield select(getAccessToken);
    const searchResult = yield call(api.search, query, page, locale, token);
    yield put(actions.setImageSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchImagesError());
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchImageSearch() {
  while (true) {
    const { payload } = yield take(actions.searchImages);
    if (!payload) {
      yield call(search, undefined, 1);
    } else {
      yield call(search, payload.query, payload.page);
    }
  }
}

export default [
  watchImageSearch,
];
