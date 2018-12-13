/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expectSaga } from 'redux-saga-test-plan';
import nock from 'nock';

import * as sagas from '../sessionSagas';
import { actions } from '../session';

const accessToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9FSTFNVVU0T0RrNU56TTVNekkyTXpaRE9EazFOMFl3UXpkRE1EUXlPRFZDUXpRM1FUSTBNQSJ9.eyJodHRwczovL25kbGEubm8vbmRsYV9pZCI6Im1ObXJ1N1lvU0lqUGVwT3JrTjRNTWhsVSIsImh0dHBzOi8vbmRsYS5uby91c2VyX25hbWUiOiJSdW5lIFN0b3Jsw7hwYSIsImh0dHBzOi8vbmRsYS5uby9jbGllbnRfaWQiOiJXVTBLcjRDRGtyTTB1TDl4WWVGVjRjbDlHYTF2QjNKWSIsImlzcyI6Imh0dHBzOi8vbmRsYS5ldS5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDM2OTA4Njg0ODM2ODgzNzU1MzIiLCJhdWQiOiJuZGxhX3N5c3RlbSIsImlhdCI6MTUwOTk3MDAyNywiZXhwIjoxNTA5OTc3MjI3LCJhenAiOiJXVTBLcjRDRGtyTTB1TDl4WWVGVjRjbDlHYTF2QjNKWSIsInNjb3BlIjoiIn0.suhXIGs7ILtdst0NEDOPeuelfG_JZeOXlwlFTXZEgjwBCnI26e4TfrVSluCttbSuE1BJ6FuXKCtO-CjpJD6zCGj9Z00vytiWLfLq7fMYyHDfipPjUMP05H-j5TQVToTE1wLFVKLco3W9yYBWSWCBzv6GLRWWZiuzyXPyUtF2oLv30e7yAeZBA8JK10sl0DfPKrC4B1eSxrTFtvkZ3WnxeDQpvzbvZ1tHQtnF6hoarC7h9qIJFI1W95h88Mq20Ci-5k8RMILRYc1u5H5XW-RAegxI2H0EhWpCo5T4Iglwc2mUTSuetHqnbgPrxapKohcAL_b3_Nkb49CacajRt9TrQQ';

let currentAccessToken;
let currentExpiresAt;
let currentPersonal;

beforeEach(() => {
  currentAccessToken = localStorage.getItem('access_token');
  currentExpiresAt = localStorage.getItem('access_token_expires_at');
  currentPersonal = localStorage.getItem('access_token_personal');
});

afterEach(() => {
  localStorage.setItem('access_token', currentAccessToken);
  localStorage.setItem('access_token_expires_at', currentExpiresAt);
  if (currentPersonal) {
    localStorage.setItem('access_token_personal', currentPersonal);
  }
});

test('sessionSagas login success', () => {
  const replace = jest.fn(() => {});
  const result = expectSaga(sagas.watchLoginSuccess)
    .withState({})
    .put(actions.setAuthenticated(true))
    .put(actions.setUserData({ name: 'Rune Storløpa', scope: '' }))
    .dispatch(
      actions.loginSuccess({
        history: { replace },
        accessToken,
      }),
    )
    .run({ silenceTimeout: true });

  return result.then(() => {
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith('/');
    expect(localStorage.getItem('access_token')).toBe(accessToken);
    expect(localStorage.getItem('access_token_personal')).toBe('true');
  });
});

test('sessionSagas logout', () => {
  nock('http://ndla-frontend')
    .get('/get_token')
    .reply(200, { access_token: accessToken });

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
    expect(localStorage.getItem('access_token')).toBe(accessToken);
    expect(localStorage.getItem('access_token_expires_at')).toBeTruthy();
    expect(localStorage.getItem('access_token_personal')).toBe('false');
  });
});
