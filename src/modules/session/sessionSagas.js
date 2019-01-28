/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put } from 'redux-saga/effects';
import { actions } from './session';
import { toLogin } from '../../util/routeHelpers';
import { decodeToken } from '../../util/jwtHelper';
import {
  personalAuthLogout,
  setAccessTokenInLocalStorage,
  clearAccessTokenFromLocalStorage,
  renewSystemAuth,
} from '../../util/authHelpers';

export function* login(accessToken, history) {
  try {
    const decoded = decodeToken(accessToken);
    yield put(actions.setAuthenticated(true));
    yield put(
      actions.setUserData({
        name: decoded['https://ndla.no/user_name'],
        scope: decoded.scope,
      }),
    );
    setAccessTokenInLocalStorage(accessToken, true);
    history.replace('/');
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
    history.replace(`${toLogin()}/failure`);
  }
}

export function* logout(federated, returnToLogin = false) {
  try {
    console.log(returnToLogin);
    yield put(actions.setAuthenticated(false));
    yield put(actions.clearUserData());
    yield call(personalAuthLogout, federated, returnToLogin);
    clearAccessTokenFromLocalStorage();
    yield call(renewSystemAuth);
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }
}

export function* watchLoginSuccess() {
  while (true) {
    const {
      payload: { accessToken, history },
    } = yield take(actions.loginSuccess);
    yield call(login, accessToken, history);
  }
}

export function* watchLogout() {
  while (true) {
    const {
      payload: { federated, returnToLogin },
    } = yield take(actions.logout);
    yield call(logout, federated, returnToLogin);
  }
}

export default [watchLoginSuccess, watchLogout];
