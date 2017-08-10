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

expectSaga.DEFAULT_TIMEOUT = 100;

test('audioSagas watchUpdateAudio create new audio', () => {
  nock('http://ndla-api')
    .post('/audio-api/v1/audio')
    .reply(200, { id: '123', title: 'unit test' });

  return expectSaga(sagas.watchUpdateAudio)
    .withState({})
    .put(actions.setAudio({ id: '123', title: 'unit test' }))
    .put(actions.updateAudioSuccess())
    .dispatch(
      actions.updateAudio({
        audio: { title: 'update title test' },
        history: { push: () => {} },
      }),
    )
    .run({ silenceTimeout: true });
});

test('audioSagas watchFetchAudio fetch audio if not in state', () => {
  nock('http://ndla-api')
    .get('/audio-api/v1/audio/123?language=nb')
    .reply(200, { id: 123, title: { title: 'unit test', langauge: 'nb' } });

  return expectSaga(sagas.watchFetchAudio)
    .withState({ audios: { all: {} } })
    .put(
      actions.setAudio({
        id: 123,
        title: { title: 'unit test', langauge: 'nb' },
      }),
    )
    .dispatch(actions.fetchAudio({ id: 123, locale: 'nb' }))
    .run({ silenceTimeout: true });
});

test('audioSagas watchFetchAudio do not refetch existing audio ', () =>
  expectSaga(sagas.watchFetchAudio)
    .withState({ audios: { all: { 123: { id: 123 } } } })
    .dispatch(actions.fetchAudio({ id: 123, locale: 'nb' }))
    .run({ silenceTimeout: true }));

test('audioSagas watchUpdateAudio update audio', () => {
  nock('http://ndla-api').put('/audio-api/v1/audio/123').reply(200, {
    id: 123,
    title: { title: 'unit test updated', language: 'en' },
  });

  return expectSaga(sagas.watchUpdateAudio)
    .withState({})
    .put(
      actions.setAudio({
        id: 123,
        title: { title: 'unit test updated', language: 'en' },
      }),
    )
    .put(actions.updateAudioSuccess())
    .dispatch(
      actions.updateAudio({
        audio: { id: 123, title: { title: 'unit test', language: 'nb' } },
      }),
    )
    .run({ silenceTimeout: true });
});
