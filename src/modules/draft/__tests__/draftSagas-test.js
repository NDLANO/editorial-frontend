/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';

import { expectSaga } from 'redux-saga-test-plan';
import * as sagas from '../draftSagas';
import { actions } from '../draft';

test('articleSagas watchFetchDraft fetch article if not in state and language is supported', () => {
  nock('http://ndla-api')
    .get('/draft-api/v1/drafts/123')
    .reply(200, {
      id: 123,
      title: 'unit test',
      supportedLanguages: ['nb'],
      content: { language: 'nb' },
    });

  nock('http://ndla-api')
    .get('/draft-api/v1/drafts/123')
    .query({ language: 'nb', fallback: true })
    .reply(200, { id: 123, title: 'unit testen', content: { language: 'nb' } });

  return expectSaga(sagas.watchFetchDraft)
    .withState({ drafts: { all: {} } })
    .put(
      actions.setDraft({
        id: 123,
        title: 'unit testen',
        language: 'nb',
        content: { language: 'nb' },
      }),
    )
    .dispatch(
      actions.fetchDraft({
        id: 123,
        language: 'nb',
        content: { language: 'nb' },
      }),
    )
    .run({ silenceTimeout: true });
});

test('articleSagas watchFetchDraft do not refetch existing article ', () =>
  expectSaga(sagas.watchFetchDraft)
    .withState({
      drafts: {
        all: {
          123: { id: '123', language: 'nb', content: { language: 'nb' } },
        },
      },
    })
    .dispatch(
      actions.fetchDraft({
        id: '123',
        language: 'nb',
        content: { language: 'nb' },
      }),
    )
    .run({ silenceTimeout: true }));

test('articleSagas watchUpdateDraft create new article', () => {
  nock('http://ndla-api')
    .post('/draft-api/v1/drafts/')
    .reply(200, {
      id: '123',
      title: 'unit test',
      language: 'nb',
      content: { language: 'nb' },
    });

  return expectSaga(sagas.watchUpdateDraft)
    .withState({})
    .put(
      actions.setDraft({
        id: '123',
        title: 'unit test',
        language: 'nb',
        content: { language: 'nb' },
      }),
    )
    .put(actions.updateDraftSuccess())
    .dispatch(
      actions.updateDraft({
        draft: {
          title: 'unit test',
          language: 'nb',
          content: { language: 'nb' },
        },
        history: { push: () => {} },
      }),
    )
    .run({ silenceTimeout: true });
});

test('articleSagas watchUpdateDraft update article', () => {
  nock('http://ndla-api')
    .patch('/draft-api/v1/drafts/123')
    .reply(200, {
      id: '123',
      title: 'unit test updated',
      language: 'nb',
      content: { language: 'nb' },
    });

  return expectSaga(sagas.watchUpdateDraft)
    .withState({})
    .put(
      actions.setDraft({
        id: '123',
        title: 'unit test updated',
        language: 'nb',
        content: { language: 'nb' },
      }),
    )
    .put(actions.updateDraftSuccess())
    .dispatch(
      actions.updateDraft({
        draft: {
          id: '123',
          title: 'unit test',
          language: 'nb',
          content: { language: 'nb' },
        },
      }),
    )
    .run({ silenceTimeout: true });
});
