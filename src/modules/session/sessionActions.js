/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';

export const setAuthenticated = createAction('SET_AUTHENTICATED');
export const setUserData = createAction('SET_USER_DATA');
export const clearUserData = createAction('CLEAR_USER_DATA');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const logout = createAction('LOGOUT');

