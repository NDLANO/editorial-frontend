/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction, Action } from 'redux-actions';
import { createSelector } from 'reselect';
import defined from 'defined';
import { License, ReduxState } from '../../interfaces';

export const fetchLicenses = createAction('FETCH_LICENSES');
export const setLicenses = createAction<License[]>('SET_LICENSES');

export const actions = {
  fetchLicenses,
  setLicenses,
};

export interface ReduxLicenseState {
  all: License[];
  hasFetched: boolean;
}

const initialState: ReduxLicenseState = {
  all: [],
  hasFetched: false,
};

export default handleActions(
  {
    SET_LICENSES: {
      next: (state: ReduxLicenseState, action: Action<License[]>) => {
        return {
          ...state,
          all: action.payload,
          hasFetched: true,
        };
      },
      throw: (state: ReduxLicenseState) => state,
    },
  },
  initialState,
);

const getLicensesFromState = (state: ReduxState): License[] => state.licenses.all;

export const getAllLicenses = createSelector(
  getLicensesFromState,
  (licenses: License[]): License[] => defined(licenses, []),
);

export const getHasFetched = (state: ReduxState) => state.licenses.hasFetched;
