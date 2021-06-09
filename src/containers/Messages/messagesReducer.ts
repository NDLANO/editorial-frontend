/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Action, handleActions } from 'redux-actions';
import { uuid } from '@ndla/util';
import {
  NewReduxMessage,
  ReduxMessage,
  ReduxMessageError,
  ReduxMessageState,
} from './messagesSelectors';

type CombinedPayloads = string | ReduxMessage | NewReduxMessage;

export default handleActions(
  {
    ADD_MESSAGE: {
      next(state: ReduxMessageState, action: Action<NewReduxMessage>) {
        const message: ReduxMessage = {
          id: uuid(),
          message: action.payload.message,
          translationKey: action.payload.translationKey,
          translationObject: action.payload.translationObject,
          severity: action.payload.severity,
          action: action.payload.action,
          statusCode: action.payload.statusCode,
          timeToLive:
            typeof action.payload.timeToLive === 'undefined' ? 1500 : action.payload.timeToLive,
        };

        return {
          ...state,
          messages: [...state.messages, message],
        };
      },
    },
    ADD_AUTH0_MESSAGE: {
      next(state: ReduxMessageState, action: Action<NewReduxMessage>) {
        if (state.messages && state.messages.find(msg => msg.type === 'auth0')) {
          return state;
        }
        const message: ReduxMessage = {
          id: uuid(),
          message: action.payload.message,
          translationKey: action.payload.translationKey,
          translationObject: action.payload.translationObject,
          severity: action.payload.severity,
          action: action.payload.action,
          type: 'auth0',
          timeToLive:
            typeof action.payload.timeToLive === 'undefined' ? 1500 : action.payload.timeToLive,
        };

        return {
          ...state,
          messages: [...state.messages, message],
        };
      },
    },
    CLEAR_ALL_MESSAGES: {
      next: state => ({
        ...state,
        messages: [],
      }),
    },
    CLEAR_MESSAGE: {
      next: (state: ReduxMessageState, action: Action<CombinedPayloads>) => {
        const messages = state.messages.filter(m => m.id !== action.payload);
        return {
          ...state,
          messages,
        };
      },
    },
    APPLICATION_ERROR: {
      throw(state: ReduxMessageState, action: Action<ReduxMessageError>) {
        if (action.payload.json && action.payload.json.messages) {
          const messages: ReduxMessage[] = action.payload.json.messages.map(m => ({
            id: uuid(),
            message: `${m.field}: ${m.message}`,
            severity: 'danger',
            timeToLive: 0,
          }));
          return {
            ...state,
            messages: [...state.messages, ...messages],
          };
        }
        return state;
      },
    },
    SHOW_SAVED: {
      next: state => ({
        ...state,
        showSaved: true,
      }),
    },
    CLEAR_SAVED: {
      next: state => ({
        ...state,
        showSaved: false,
      }),
    },
  },
  { messages: [], showSaved: false },
);
