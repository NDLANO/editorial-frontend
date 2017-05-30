/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put } from 'redux-saga/effects';
import * as actions from './sessionActions';
import { toSearch, toLogin } from '../../routes';
import { decodeIdToken } from '../../util/jwtHelper';

export function* login(idToken, history) {
  try {
    yield put(actions.setAuthenticated(true));
    yield put(actions.setUserData(decodeIdToken(idToken)));
    localStorage.setItem('id_token', idToken);
    history.replace(toSearch());
  } catch (error) {
    history.replace(`${toLogin()}/failure`);
  }
}

export function* watchLoginSuccess() {
  while (true) {
    const { payload: { idToken, history } } = yield take(actions.loginSuccess);

    yield call(login, idToken, history);
  }
}

export default [
  watchLoginSuccess,
];
