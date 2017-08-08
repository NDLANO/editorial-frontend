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
    .post('/audio-api/v1/audio/')
    .reply(200, { id: '123', title: 'unit test' });

  return expectSaga(sagas.watchUpdateAudio)
    .withState({})
    .dispatch(actions.setAudio({ id: '123', title: 'unit test' }))
    .dispatch(actions.updateAudioSuccess())
    .dispatch(
      actions.updateAudio({
        audio: { title: 'update title test' },
        history: { push: () => {} },
      }),
    )
    .run({ silenceTimeout: true });
});
