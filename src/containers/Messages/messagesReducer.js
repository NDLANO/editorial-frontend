/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import { uuid } from '@ndla/util';
import * as actions from './messagesActions';

export default handleActions(
  {
    [actions.addMessage]: {
      next(state, action) {
        const message = {
          id: uuid(),
          message: action.payload.message,
          translationKey: action.payload.translationKey,
          severity: action.payload.severity,
          action: action.payload.action,
          statusCode: action.payload.statusCode,
          timeToLive:
            typeof action.payload.timeToLive === 'undefined'
              ? 1500
              : action.payload.timeToLive,
        };

        return {
          ...state,
          messages: [...state.messages, message],
        };
      },
    },

    [actions.clearAllMessages]: {
      next: state => ({
        ...state,
        messages: [],
      }),
    },

    [actions.clearMessage]: {
      next: (state, action) => ({
        ...state,
        messages: state.messages.filter(m => m.id !== action.payload),
      }),
    },

    [actions.applicationError]: {
      throw(state, action) {
        if (action.payload.json && action.payload.json.messages) {
          const messages = action.payload.json.messages.map(m => ({
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
    [actions.showSaved]: {
      next: state => ({
        ...state,
        showSaved: true,
      }),
    },
    [actions.clearSaved]: {
      next: state => ({
        ...state,
        showSaved: false,
      }),
    },
  },
  { messages: [], showSaved: false },
);
