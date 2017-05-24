/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';

import { expectSaga } from 'redux-saga-test-plan';
import * as sagas from '../articleSagas';
import { actions } from '../articleDucks';

expectSaga.DEFAULT_TIMEOUT = 100;

test('articleSagas watchFetchArticle fetch article if not in state', () => {
  nock('http://ndla-api')
    .get('/article-api/v1/articles/123')
    .reply(200, { id: 123, title: 'unit test' });

  return expectSaga(sagas.watchFetchArticle)
          .withState({ articles: { all: {} }, accessToken: '123456789' })
          .put(actions.setArticle({ id: 123, title: 'unit test' }))

          .dispatch(actions.fetchArticle(123))
          .run({ silenceTimeout: true });
});

test('articleSagas watchFetchArticle do not refetch existing article ', () =>
    expectSaga(sagas.watchFetchArticle)
      .withState({ articles: { all: { 123: { id: '123' } } }, accessToken: '123456789' })
      .dispatch(actions.fetchArticle('123'))
      .run({ silenceTimeout: true }));

test('articleSagas watchUpdateArticle create new article', () => {
  nock('http://ndla-api')
    .post('/article-api/v1/articles/')
    .reply(200, { id: '123', title: 'unit test' });

  return expectSaga(sagas.watchUpdateArticle)
          .withState({ accessToken: '123456789' })
          .put(actions.setArticle({ id: '123', title: 'unit test' }))
          .put(actions.updateArticleSuccess())

          .dispatch(actions.updateArticle({
            article: { title: 'unit test' },
            history: { push: () => {} },
          }))
          .run({ silenceTimeout: true });
});

test('articleSagas watchUpdateArticle update article', () => {
  nock('http://ndla-api')
    .patch('/article-api/v1/articles/123')
    .reply(200, { id: '123', title: 'unit test updated' });

  return expectSaga(sagas.watchUpdateArticle)
          .withState({ accessToken: '123456789' })
          .put(actions.setArticle({ id: '123', title: 'unit test updated' }))
          .put(actions.updateArticleSuccess())

          .dispatch(actions.updateArticle({
            article: { id: '123', title: 'unit test' },
          }))
          .run({ silenceTimeout: true });
});
