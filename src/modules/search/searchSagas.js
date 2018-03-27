/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put } from 'redux-saga/effects';

import * as actions from './search';
import * as api from './searchApi';

export function* search(query) {
  try {
    const searchResult = yield call(api.search, query);
    yield put(actions.setSearchResult(searchResult));
  } catch (error) {
    yield put(actions.searchError());
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchSearch() {
  while (true) {
    const { payload: query } = yield take(actions.search);
    yield call(search, query);
  }
}

export default [watchSearch];
