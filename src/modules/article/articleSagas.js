/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { actions, getArticle } from './article';
import * as api from './articleApi';
import { toEditTopicArticle } from '../../util/routeHelpers';
import * as messageActions from '../../containers/Messages/messagesActions';

export function* fetchArticle(id) {
  try {
    const article = yield call(api.fetchArticle, id);
    yield put(actions.setArticle(article));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchArticle() {
  while (true) {
    const { payload: id } = yield take(actions.fetchArticle);
    // console.log('called');
    const article = yield select(getArticle(id));
    if (!article || article.id !== id) {
      yield call(fetchArticle, id);
    }
  }
}

export function* updateArticle(article) {
  try {
    const updatedArticle = yield call(api.updateArticle, article);
    yield put(actions.setArticle(updatedArticle));
    yield put(actions.updateArticleSuccess());
    yield put(
      messageActions.addMessage({ translationKey: 'topicArticleForm.savedOk' }),
    );
  } catch (error) {
    yield put(actions.updateArticleError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* createArticle(article, history) {
  try {
    const createdArticle = yield call(api.createArticle, article);
    yield put(actions.setArticle(createdArticle));
    history.push(toEditTopicArticle(createdArticle.id));
    yield put(actions.updateArticleSuccess());
    yield put(
      messageActions.addMessage({
        translationKey: 'topicArticleForm.createdOk',
      }),
    );
  } catch (error) {
    yield put(actions.updateArticleError());
    // TODO: handle error
    yield put(messageActions.applicationError(error));
  }
}

export function* watchUpdateArticle() {
  while (true) {
    const { payload: { article, history } } = yield take(actions.updateArticle);
    if (article.id) {
      yield call(updateArticle, article);
    } else {
      yield call(createArticle, article, history);
    }
  }
}

export default [watchFetchArticle, watchUpdateArticle];
