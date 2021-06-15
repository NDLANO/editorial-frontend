/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Action, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { LocaleType, ReduxState } from '../../interfaces';

export type ReduxLocaleState = LocaleType;

const initialState: ReduxLocaleState = 'nb';
export default handleActions(
  {
    SET_LOCALE: {
      next: (state: ReduxLocaleState, action: Action<ReduxLocaleState>) => action.payload,
      throw: state => state,
    },
  },
  initialState,
);

export const getLocaleFromState = (state: ReduxState): ReduxLocaleState => state.locale;

export const getLocale: (state: ReduxState) => ReduxLocaleState = createSelector(
  getLocaleFromState,
  locale => locale,
);
