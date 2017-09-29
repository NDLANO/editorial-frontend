/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import * as api from '../article/articleApi';
import { actions, getHasFetched } from './tag';

export function* fetchTags(language) {
  try {
    const tags = yield call(api.fetchTags, language);
    yield put(actions.setTags(tags));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchTags() {
  while (true) {
    const { payload } = yield take(actions.fetchTags);
    const refetch = payload ? payload.refetch : undefined;
    const language = payload ? payload.language : undefined;
    const hasFetched = yield select(getHasFetched);
    if (!hasFetched || refetch) {
      yield call(fetchTags, language);
    }
  }
}

export default [watchFetchTags];
