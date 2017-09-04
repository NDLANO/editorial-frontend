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

test('imageSagas watchUpdateImage create new image', () => {
  nock('http://ndla-api')
    .post('/image-api/v2/images')
    .reply(200, { id: '123', title: 'unit test' });

  return expectSaga(sagas.watchUpdateImage)
    .withState({})
    .put(actions.setImage({ id: '123', title: 'unit test' }))
    .put(actions.updateImageSuccess())
    .dispatch(
      actions.updateImage({
        image: { title: 'update title test' },
        history: { push: () => {} },
      }),
    )
    .run({ silenceTimeout: true });
});

test('imageSagas watchFetchImage fetch image if not in state', () => {
  nock('http://ndla-api')
    .get('/image-api/v2/images/123?language=nb')
    .reply(200, { id: 123, title: { title: 'unit test', langauge: 'nb' } });

  return expectSaga(sagas.watchFetchImage)
    .withState({ images: { all: {} } })
    .put(
      actions.setImage({
        id: 123,
        title: { title: 'unit test', langauge: 'nb' },
      }),
    )
    .dispatch(actions.fetchImage({ id: 123, locale: 'nb' }))
    .run({ silenceTimeout: true });
});

test('imageSagas watchFetchImage do not refetch existing image ', () =>
  expectSaga(sagas.watchFetchImage)
    .withState({ images: { all: { 123: { id: 123 } } } })
    .dispatch(actions.fetchImage({ id: 123, locale: 'nb' }))
    .run({ silenceTimeout: true }));
