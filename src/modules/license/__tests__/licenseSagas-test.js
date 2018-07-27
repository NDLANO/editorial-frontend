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

test('licenseSagas fetch licenses if not already defined', () =>
  expectSaga(
    sagas.watchFetchLicenses,
    nock('http://ndla-api')
      .persist()
      .get('/draft-api/v1/drafts/licenses/')
      .reply(200, mockLicenses),
  )
    .withState({ licenses: { hasFetched: false } })
    .put(actions.setLicenses(mockLicenses))
    .dispatch(actions.fetchLicenses())
    .silentRun());

test('licenseSagas do not fetch licenses if already fetched', () =>
  expectSaga(
    sagas.watchFetchLicenses,
    nock('http://ndla-api')
      .persist()
      .get('/draft-api/v1/drafts/licenses/')
      .reply(200, mockLicenses),
  )
    .withState({ licenses: { hasFetched: true } })
    .silentRun());

nock.cleanAll();
