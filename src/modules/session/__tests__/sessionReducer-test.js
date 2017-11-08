/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { getSessionStateFromLocalStorage, actions } from '../session';

const accessToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9FSTFNVVU0T0RrNU56TTVNekkyTXpaRE9EazFOMFl3UXpkRE1EUXlPRFZDUXpRM1FUSTBNQSJ9.eyJodHRwczovL25kbGEubm8vbmRsYV9pZCI6Im1ObXJ1N1lvU0lqUGVwT3JrTjRNTWhsVSIsImh0dHBzOi8vbmRsYS5uby91c2VyX25hbWUiOiJSdW5lIFN0b3Jsw7hwYSIsImh0dHBzOi8vbmRsYS5uby9jbGllbnRfaWQiOiJXVTBLcjRDRGtyTTB1TDl4WWVGVjRjbDlHYTF2QjNKWSIsImlzcyI6Imh0dHBzOi8vbmRsYS5ldS5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDM2OTA4Njg0ODM2ODgzNzU1MzIiLCJhdWQiOiJuZGxhX3N5c3RlbSIsImlhdCI6MTUwOTk3MDAyNywiZXhwIjoxNTA5OTc3MjI3LCJhenAiOiJXVTBLcjRDRGtyTTB1TDl4WWVGVjRjbDlHYTF2QjNKWSIsInNjb3BlIjoiIn0.suhXIGs7ILtdst0NEDOPeuelfG_JZeOXlwlFTXZEgjwBCnI26e4TfrVSluCttbSuE1BJ6FuXKCtO-CjpJD6zCGj9Z00vytiWLfLq7fMYyHDfipPjUMP05H-j5TQVToTE1wLFVKLco3W9yYBWSWCBzv6GLRWWZiuzyXPyUtF2oLv30e7yAeZBA8JK10sl0DfPKrC4B1eSxrTFtvkZ3WnxeDQpvzbvZ1tHQtnF6hoarC7h9qIJFI1W95h88Mq20Ci-5k8RMILRYc1u5H5XW-RAegxI2H0EhWpCo5T4Iglwc2mUTSuetHqnbgPrxapKohcAL_b3_Nkb49CacajRt9TrQQ';

test('reducers/session getSessionStateFromLocalStorage when access_token exists in local storage', () => {
  localStorage.setItem('access_token', accessToken);
  const nextState = getSessionStateFromLocalStorage();

  expect(nextState).toMatchSnapshot();

  localStorage.setItem('access_token', '12345678');
});

test('reducers/session getSessionStateFromLocalStorage when access_token does not exists in local storage', () => {
  localStorage.removeItem('access_token');

  const nextState = getSessionStateFromLocalStorage();
  expect(nextState).toMatchSnapshot();

  localStorage.setItem('access_token', '12345678');
});

test('reducers/session initialState when access_token exists in localstorage', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toMatchSnapshot();
});

test('reducers/session sets if authenticated', () => {
  const nextState = reducer(undefined, {
    type: actions.setAuthenticated,
    payload: true,
  });
  expect(nextState).toMatchSnapshot();
});

test('reducers/session sets if authenticated', () => {
  const nextState = reducer(undefined, {
    type: actions.setAuthenticated,
    payload: false,
  });
  expect(nextState).toMatchSnapshot();
});

test('reducers/session sets user data', () => {
  const nextState = reducer(undefined, {
    type: actions.setUserData,
    payload: {
      name: 'Ola Nordmann',
    },
  });
  expect(nextState).toMatchSnapshot();
});

test('reducers/session clears user data', () => {
  const nextState = reducer(
    {
      user: {
        name: 'Ola Nordmann',
      },
      authenicated: false,
    },
    {
      type: actions.clearUserData,
    },
  );

  expect(nextState.user).toEqual({});
});
