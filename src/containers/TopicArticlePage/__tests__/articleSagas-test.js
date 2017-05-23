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
          .withState({ articles: { all: {} }, locale: 'nb', accessToken: '123456789' })
          .put(actions.setArticle({ id: 123, title: 'unit test' }))

          .dispatch(actions.fetchArticle(123))
          .run({ silenceTimeout: true });
});

test('articleSagas watchFetchArticle do not refetch existing article ', () =>
    expectSaga(sagas.watchFetchArticle)
      .withState({ articles: { all: { 123: { id: 123 } } }, locale: 'nb', accessToken: '123456789' })
      .dispatch(actions.fetchArticle(123))
      .run({ silenceTimeout: true }));
