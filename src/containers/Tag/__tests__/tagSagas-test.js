/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import nock from 'nock';

import { expectSaga } from 'redux-saga-test-plan';
import * as sagas from '../tagSagas';
import * as actions from '../tagDucks';

expectSaga.DEFAULT_TIMEOUT = 100;

test('tagSagas fetch tags if nor already defined', () => {
  nock('http://ndla-api')
    .get('/article-api/v1/articles/tags/?size=7000')
    .reply(200, ['tag1', 'tag2', 'tag3']);

  return expectSaga(sagas.watchFetchTags)
          .withState({ tags: { hasFetched: false }, accessToken: '123456789' })
          .put(actions.setTags(['tag1', 'tag2', 'tag3']))

          .dispatch(actions.fetchTags())
          .run({ silenceTimeout: true });
});

test('tagSagas do not fetch tags if already fetched', () => {
  nock('http://ndla-api')
    .get('/article-api/v1/articles/tags/?size=7000')
    .reply(200, ['tag1', 'tag2', 'tag3']);

  return expectSaga(sagas.watchFetchTags)
          .withState({ tags: { hasFetched: true }, accessToken: '123456789' })
          .run({ silenceTimeout: true });
});
