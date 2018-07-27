/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';

import { expectSaga } from 'redux-saga-test-plan';
import * as sagas from '../audioSagas';
import { actions } from '../audio';

test('audioSagas watchUpdateAudio create new audio', () =>
  expectSaga(
    sagas.watchUpdateAudio,
    nock('http://ndla-api')
      .persist()
      .post('/audio-api/v1/audio')
      .reply(200, { id: '123', title: 'unit test' }),
  )
    .withState({})
    .put(actions.setAudio({ id: '123', title: 'unit test', language: 'nb' }))
    .put(actions.updateAudioSuccess())
    .dispatch(
      actions.updateAudio({
        audio: { title: 'update title test', language: 'nb' },
        history: { push: () => {} },
      }),
    )
    .silentRun());

test('audioSagas watchFetchAudio fetch audio if not in state', () =>
  expectSaga(
    sagas.watchFetchAudio,
    nock('http://ndla-api')
      .persist()
      .get('/audio-api/v1/audio/123?language=nb')
      .reply(200, { id: 123, title: { title: 'unit test', langauge: 'nb' } }),
  )
    .withState({ audios: { all: {} } })
    .put(
      actions.setAudio({
        id: 123,
        title: { title: 'unit test', langauge: 'nb' },
        language: 'nb',
      }),
    )
    .dispatch(actions.fetchAudio({ id: 123, language: 'nb' }))
    .silentRun());

test('audioSagas watchFetchAudio do not refetch existing audio ', () =>
  expectSaga(sagas.watchFetchAudio)
    .withState({ audios: { all: { 123: { id: 123, language: 'nb' } } } })
    .dispatch(actions.fetchAudio({ id: 123, language: 'nb' }))
    .silentRun());

test('audioSagas watchUpdateAudio update audio', () =>
  expectSaga(
    sagas.watchUpdateAudio,
    nock('http://ndla-api')
      .persist()
      .put('/audio-api/v1/audio/123')
      .reply(200, {
        id: 123,
        title: { title: 'unit test updated', language: 'en' },
      }),
  )
    .withState({})
    .put(
      actions.setAudio({
        id: 123,
        title: { title: 'unit test updated', language: 'en' },
        language: 'en',
      }),
    )
    .put(actions.updateAudioSuccess())
    .dispatch(
      actions.updateAudio({
        audio: {
          id: 123,
          title: { title: 'unit test', language: 'en' },
          language: 'en',
        },
      }),
    )
    .silentRun());

nock.cleanAll();
