/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';
import { createSelector } from 'reselect';
import defined from 'defined';

export const fetchLicenses = createAction('FETCH_LICENSES');
export const setLicenses = createAction('SET_LICENSES');

export const actions = {
  fetchLicenses,
  setLicenses,
};

const initalState = {
  all: [],
  hasFetched: false,
};

export default handleActions(
  {
    [setLicenses]: {
      next: (state, action) => ({
        ...state,
        all: action.payload,
        hasFetched: true,
      }),
      throw: state => state,
    },
  },
  initalState,
);

const getLicensesFromState = state => state.licenses.all;

export const getAllLicenses = createSelector([getLicensesFromState], licenses =>
  defined(licenses, []),
);

export const getHasFetched = state => state.licenses.hasFetched;
