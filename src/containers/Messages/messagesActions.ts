/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';
import { NewReduxMessage, ReduxMessageError } from './messagesSelectors';

export const applicationError = createAction<ReduxMessageError>('APPLICATION_ERROR');
export const addMessage = createAction<NewReduxMessage>('ADD_MESSAGE');
export const clearAllMessages = createAction('CLEAR_ALL_MESSAGES');
export const clearMessage = createAction<string>('CLEAR_MESSAGE');
export const showSaved = createAction('SHOW_SAVED');
export const clearSaved = createAction('CLEAR_SAVED');
export const addAuth0Message = createAction<NewReduxMessage>('ADD_AUTH0_MESSAGE');

export function timeoutMessage(message: any) {
  return (dispatch: Dispatch) =>
    setTimeout(() => dispatch(clearMessage(message.id)), message.timeToLive);
}
