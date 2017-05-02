/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { actions, getArticle } from './articleDucks';
import * as api from './articleApi';
import { getAccessToken } from '../App/sessionSelectors';

export function* fetchArticle(id) {
  try {
    const token = yield select(getAccessToken);
    const article = yield call(api.fetchArticle, id, token);
    yield put(actions.setArticle(article));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchArticle() {
  while (true) {
    const { payload: id } = yield take(actions.fetchArticle);
    const article = yield select(getArticle(id));
    if (!article || article.id !== id) {
      yield call(fetchArticle, id);
    }
  }
}

export default [
  watchFetchArticle,
];
