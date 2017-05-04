/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';

import * as api from './tagApi';
import { actions, getAllTags } from './tagDucks';
import { getAccessToken } from '../App/sessionSelectors';

export function* fetchTags() {
  try {
    const token = yield select(getAccessToken);
    const tags = yield call(api.fetchTags, token);
    yield put(actions.setTags(tags));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchTags() {
  while (true) {
    yield take(actions.fetchTags);
    const tags = yield select(getAllTags);
    if (tags.length > 0) {
      yield call(fetchTags);
    }
  }
}

export default [
  watchFetchTags,
];
