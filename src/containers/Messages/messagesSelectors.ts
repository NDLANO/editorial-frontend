/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import { MessageSeverity, ReduxState } from '../../interfaces';

export interface ReduxMessage {
  id: string;
  message?: string;
  translationKey?: string;
  translationObject?: {
    message?: string;
  };
  severity?: MessageSeverity;
  action?: string;
  timeToLive: number;
  statusCode?: number;
  type?: string;
}

export interface NewReduxMessage extends Omit<ReduxMessage, 'id'> {}

export interface ReduxMessageState {
  showSaved: boolean;
  messages: ReduxMessage[];
}

export interface ReduxMessageError extends Partial<Error> {
  json?: {
    messages?: {
      field: string;
      message: string;
    }[];
  };
}

export const getMessagesFromState = (state: ReduxState) => state.messages;

export const getMessages = createSelector([getMessagesFromState], messages => messages.messages);

export const getShowSaved = (state: ReduxState) => state.messages.showSaved;
