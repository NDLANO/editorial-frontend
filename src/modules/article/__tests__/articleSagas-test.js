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
import { actions } from '../article';

test('articleSagas watchFetchArticle fetch article if not in state and language is supported', () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/123')
    .reply(200, { id: 123, title: 'unit test', supportedLanguages: ['nb'] });

  nock('http://ndla-api')
    .get('/article-api/v2/articles/123')
    .query({ language: 'nb' })
    .reply(200, { id: 123, title: 'unit testen' });

  return expectSaga(sagas.watchFetchArticle)
    .withState({ articles: { all: {} } })
    .put(actions.setArticle({ id: 123, title: 'unit testen', language: 'nb' }))
    .dispatch(actions.fetchArticle({ id: 123, language: 'nb' }))
    .run({ silenceTimeout: true });
});

test('articleSagas watchFetchArticle fetch article if not in state and language is not supported', () => {
  nock('http://ndla-api').get('/article-api/v2/articles/123').reply(200, {
    id: 123,
    title: 'unit test',
    supportedLanguages: ['en'],
    copyright: [],
    revision: 3,
    articleType: 'standard',
  });

  return expectSaga(sagas.watchFetchArticle)
    .withState({ articles: { all: {} } })
    .put(
      actions.setArticle({
        id: 123,
        language: 'nb',
        articleType: 'standard',
        copyright: [],
        revision: 3,
        supportedLanguages: ['en'],
      }),
    )
    .dispatch(actions.fetchArticle({ id: 123 }))
    .run({ silenceTimeout: true });
});

test('articleSagas watchFetchArticle do not refetch existing article ', () =>
  expectSaga(sagas.watchFetchArticle)
    .withState({ articles: { all: { 123: { id: '123', language: 'nb' } } } })
    .dispatch(actions.fetchArticle({ id: '123', language: 'nb' }))
    .run({ silenceTimeout: true }));

test('articleSagas watchUpdateArticle create new article', () => {
  nock('http://ndla-api')
    .post('/article-api/v2/articles/')
    .reply(200, { id: '123', title: 'unit test' });

  return expectSaga(sagas.watchUpdateArticle)
    .withState({})
    .put(actions.setArticle({ id: '123', title: 'unit test' }))
    .put(actions.updateArticleSuccess())
    .dispatch(
      actions.updateArticle({
        article: { title: 'unit test' },
        history: { push: () => {} },
      }),
    )
    .run({ silenceTimeout: true });
});

test('articleSagas watchUpdateArticle update article', () => {
  nock('http://ndla-api')
    .patch('/article-api/v2/articles/123')
    .reply(200, { id: '123', title: 'unit test updated' });

  return expectSaga(sagas.watchUpdateArticle)
    .withState({})
    .put(
      actions.setArticle({
        id: '123',
        title: 'unit test updated',
        language: 'nb',
      }),
    )
    .put(actions.updateArticleSuccess())
    .dispatch(
      actions.updateArticle({
        article: { id: '123', title: 'unit test', language: 'nb' },
      }),
    )
    .run({ silenceTimeout: true });
});
