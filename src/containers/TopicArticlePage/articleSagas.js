/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, takeEvery, call, put, select } from 'redux-saga/effects';
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

export function* updateArticle({ payload: article }) {
  try {
    const token = yield select(getAccessToken);
    const updatedArticle = yield call(api.updateArticle, article, token);
    yield put(actions.setArticle(updatedArticle));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}
export function* watchUpdateArticle() {
  yield takeEvery(actions.updateArticle, updateArticle);
}

export default [
  watchFetchArticle,
  watchUpdateArticle,
];
