/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';

import { expectSaga } from 'redux-saga-test-plan';
import * as sagas from '../licenseSagas';
import * as actions from '../license';
import mockLicenses from './mockLicenses';

expectSaga.DEFAULT_TIMEOUT = 100;

test('licenseSagas fetch licenses if not already defined', () => {
  nock('http://ndla-api')
    .get('/article-api/v1/articles/licenses')
    .reply(200, mockLicenses);

  return expectSaga(sagas.watchFetchLicenses)
    .withState({ licenses: { hasFetched: false } })
    .put(actions.setLicenses(mockLicenses))
    .dispatch(actions.fetchLicenses())
    .run({ silenceTimeout: true });
});

test('licenseSagas do not fetch licenses if already fetched', () => {
  nock('http://ndla-api')
    .get('/article-api/v1/articles/licenses')
    .reply(200, mockLicenses);

  return expectSaga(sagas.watchFetchLicenses)
    .withState({ licenses: { hasFetched: true } })
    .run({ silenceTimeout: true });
});
