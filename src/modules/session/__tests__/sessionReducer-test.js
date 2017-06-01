/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { getSessionStateFromLocalStorage, actions } from '../session';

test('reducers/session getSessionStateFromLocalStorage when id_token exists in local storage', () => {
  localStorage.setItem('id_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBfbWV0YWRhdGEiOnsibmRsYV9pZCI6IlFhZHZwNjk5aUh0ak9tREhNQ2xtWGJBLSJ9LCJuYW1lIjoiw5h5dmluZCBNYXJ0aGluc2VuIiwiaXNzIjoiaHR0cHM6Ly9uZGxhLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNzA2NDA0NTM4NTY0ODQwNDgxNiIsImF1ZCI6IldVMEtyNENEa3JNMHVMOXhZZUZWNGNsOUdhMXZCM0pZIiwiZXhwIjoxNDk2MjM2MDAzLCJpYXQiOjE0OTYyMzU0MDMsIm5vbmNlIjoibFE1TVJacFY2ODlubVpPQzA5QlNRaTE5Rn4xNWY5OUEiLCJhdF9oYXNoIjoiOUZCSXRSQ1h4ZlNTaG1rMEpEZUtJUSJ9.-LhugcAhXJltZ6KI9d1hzR8XklaDCFK7AsmQrZ72oXA9');
  const nextState = getSessionStateFromLocalStorage();

  expect(nextState).toMatchSnapshot();
});

test('reducers/session getSessionStateFromLocalStorage when id_token does not exists in local storage', () => {
  localStorage.removeItem('id_token');

  const nextState = getSessionStateFromLocalStorage();
  expect(nextState).toMatchSnapshot();

  localStorage.setItem('id_token', '12345678');
});

test('reducers/session initialState when id_token exists in localstorage', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toMatchSnapshot();
});

test('reducers/session sets if authenticated', () => {
  const nextState = reducer(undefined, { type: actions.setAuthenticated, payload: true });
  expect(nextState).toMatchSnapshot();
});


test('reducers/session sets if authenticated', () => {
  const nextState = reducer(undefined, { type: actions.setAuthenticated, payload: false });
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
  const nextState = reducer({
    user: {
      name: 'Ola Nordmann',
    },
    authenicated: false,
  }, {
    type: actions.clearUserData,
  });

  expect(nextState.user).toEqual({});
});
