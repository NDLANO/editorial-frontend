/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';

import { expectSaga } from 'redux-saga-test-plan';
import * as sagas from '../imageSagas';
import { actions } from '../image';

test('imageSagas watchUpdateImage create new image', () =>
  expectSaga(
    sagas.watchUpdateImage,
    nock('http://ndla-api')
      .persist()
      .post('/image-api/v2/images')
      .reply(200, { id: '123', title: 'unit test' }),
  )
    .withState({})
    .put(actions.setImage({ id: '123', title: 'unit test', language: 'nb' }))
    .put(actions.updateImageSuccess())
    .dispatch(
      actions.updateImage({
        image: { title: 'update title test', language: 'nb' },
        history: { push: () => {} },
      }),
    )
    .silentRun());

test('imageSagas watchFetchImage fetch image if not in state', () =>
  expectSaga(
    sagas.watchFetchImage,
    nock('http://ndla-api')
      .persist()
      .get('/image-api/v2/images/124?language=nb')
      .reply(200, { id: 124, title: { title: 'unit test', langauge: 'nb' } }),
  )
    .withState({ images: { all: {} } })
    .put(
      actions.setImage({
        id: 124,
        title: { title: 'unit test', langauge: 'nb' },
        language: 'nb',
      }),
    )
    .dispatch(actions.fetchImage({ id: 124, language: 'nb' }))
    .silentRun());

test('imageSagas watchFetchImage do not refetch existing image ', () =>
  expectSaga(sagas.watchFetchImage)
    .withState({ images: { all: { 126: { id: 126, language: 'nb' } } } })
    .dispatch(actions.fetchImage({ id: 126, language: 'nb' }))
    .silentRun());

nock.cleanAll();
