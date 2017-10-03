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
import * as actions from '../tag';

test('tagSagas fetch tags if not already defined', () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/tags/')
    .query({ language: 'nb', size: 7000 })
    .reply(200, [{ language: 'nb', tags: ['tag1', 'tag2', 'tag3'] }]);

  return expectSaga(sagas.watchFetchTags)
    .withState({ tags: { all: {} } })
    .put(actions.setTags([{ language: 'nb', tags: ['tag1', 'tag2', 'tag3'] }]))
    .dispatch(actions.fetchTags({ language: 'nb' }))
    .run({ silenceTimeout: true });
});

test('tagSagas do not fetch tags if already fetched', () => {
  nock('http://ndla-api')
    .get('/article-api/v2/articles/tags/')
    .query({ language: 'nb', size: 7000 })
    .reply(200, [{ language: 'nb', tags: ['tag1', 'tag2', 'tag3'] }]);

  return expectSaga(sagas.watchFetchTags)
    .withState({
      tags: {
        all: {
          nb: {
            language: 'nb',
            tags: ['tag1', 'tag2', 'tag3'],
            hasFetched: true,
          },
        },
      },
    })
    .run({ silenceTimeout: true });
});
