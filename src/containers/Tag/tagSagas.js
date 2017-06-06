/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import * as api from '../TopicArticlePage/articleApi';
import { actions, getHasFetched } from './tagDucks';

export function* fetchTags() {
  try {
    const tags = yield call(api.fetchTags);
    yield put(actions.setTags(tags));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchTags() {
  while (true) {
    yield take(actions.fetchTags);
    const hasFetched = yield select(getHasFetched);
    if (!hasFetched) {
      yield call(fetchTags);
    }
  }
}

export default [watchFetchTags];
