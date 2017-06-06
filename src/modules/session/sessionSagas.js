/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put } from 'redux-saga/effects';
import { actions } from './session';
import { toLogin } from '../../routes';
import { decodeToken } from '../../util/jwtHelper';
import {
  authLogout,
  setIdTokenInLocalStorage,
  clearIdTokenFromLocalStorage,
} from '../../util/authHelpers';

export function* login(idToken, history) {
  try {
    const decoded = decodeToken(idToken);
    yield put(actions.setAuthenticated(true));
    yield put(actions.setUserData({ name: decoded.name }));
    setIdTokenInLocalStorage(idToken);
    history.replace('/');
  } catch (error) {
    console.error(error); //eslint-disable-line
    history.replace(`${toLogin()}/failure`);
  }
}

export function* logout(federated) {
  try {
    yield put(actions.setAuthenticated(false));
    yield put(actions.clearUserData());
    authLogout(federated);
    clearIdTokenFromLocalStorage();
  } catch (error) {
    console.error(error); //eslint-disable-line
  }
}

export function* watchLoginSuccess() {
  while (true) {
    const { payload: { idToken, history } } = yield take(actions.loginSuccess);
    yield call(login, idToken, history);
  }
}

export function* watchLogout() {
  while (true) {
    const { payload: { federated } } = yield take(actions.logout);
    yield call(logout, federated);
  }
}

export default [watchLoginSuccess, watchLogout];
