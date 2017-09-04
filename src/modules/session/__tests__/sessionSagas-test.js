/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expectSaga } from 'redux-saga-test-plan';
import sinon from 'sinon';

import * as sagas from '../sessionSagas';
import { actions } from '../session';

const idToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

let currentIdToken;
let currentExpiresAt;

beforeEach(() => {
  currentIdToken = localStorage.getItem('id_token');
  currentExpiresAt = localStorage.getItem('id_token_expires_at');
});

afterEach(() => {
  localStorage.setItem('id_token', currentIdToken);
  localStorage.setItem('id_token_expires_at', currentExpiresAt);
});

test('sessionSagas login success', () => {
  const replace = sinon.spy(() => {});
  const result = expectSaga(sagas.watchLoginSuccess)
    .withState({})
    .put(actions.setUserData({ name: 'John Doe' }))
    .put(actions.setAuthenticated(true))
    .dispatch(
      actions.loginSuccess({
        history: { replace },
        idToken,
      }),
    )
    .run({ silenceTimeout: true });

  return result.then(() => {
    expect(replace.calledOnce).toBe(true);
    expect(replace.calledWith('/')).toBe(true);
    expect(localStorage.getItem('id_token')).toBe(idToken);
  });
});

test('sessionSagas logout', () => {
  const result = expectSaga(sagas.watchLogout)
    .withState({})
    .put(actions.clearUserData())
    .put(actions.setAuthenticated(false))
    .dispatch(
      actions.logout({
        federated: true,
      }),
    )
    .run({ silenceTimeout: true });

  return result.then(() => {
    expect(localStorage.getItem('id_token')).toBe(null);
    expect(localStorage.getItem('id_token_expires_at')).toBe(null);
  });
});
