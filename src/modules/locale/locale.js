/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

const initalState = 'nb';
export default handleActions(
  {
    SET_LOCALE: {
      next: (state, action) => action.payload,
      throw: state => state,
    },
  },
  initalState,
);

const getLocaleFromState = state => state.locale;

export const getLocale = createSelector(
  [getLocaleFromState],
  locale => locale,
);
