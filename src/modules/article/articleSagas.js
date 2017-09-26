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
import { toEditArticle } from '../../util/routeHelpers';
import * as messageActions from '../../containers/Messages/messagesActions';

export function* fetchArticle(id, language = 'nb') {
  try {
    const tempArticle = yield call(api.fetchArticle, id);
    if (tempArticle.supportedLanguages.includes(language)) {
      const article = yield call(api.fetchArticle, id, language);
      yield put(actions.setArticle({ ...article, language }));

    } else {
      yield put(actions.setArticle({
        id: tempArticle.id,
        language,
        copyright: tempArticle.copyright,
        articleType: 'standard',
        revision: tempArticle.revision,
        supportedLanguages: tempArticle.supportedLanguages, }));
    }
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchArticle() {
  while (true) {
    const { payload: { id, language } } = yield take(actions.fetchArticle);
    // console.log('called');
    const article = yield select(getArticle(id));
    if (!article || article.id !== id || article.language !== language) {
      yield call(fetchArticle, id, language);
    }
  }
}

export function* updateArticle(article) {
  try {
    const updatedArticle = yield call(api.updateArticle, article);
    yield put(actions.setArticle(updatedArticle));
    yield put(actions.updateArticleSuccess());
    yield put(messageActions.addMessage({ translationKey: 'form.savedOk' }));
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
    history.push(toEditArticle(createdArticle.id, createdArticle.articleType, article.language));
    yield put(actions.updateArticleSuccess());
    yield put(
      messageActions.addMessage({
        translationKey: 'form.createdOk',
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
