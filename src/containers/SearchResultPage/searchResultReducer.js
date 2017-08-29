/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import * as actions from './searchResultActions';

export const initalState = {
  results: [],
  totalCount: 1,
  pageSize: 10,
  searching: false,
};

export default handleActions(
  {
    [actions.search]: {
      next: state => ({ ...state, searching: true }),
      throw: state => state,
    },
    [actions.setSearchResult]: {
      next: (state, action) => ({
        ...state,
        ...action.payload,
        searching: false,
      }),
      throw: state => state,
    },
    [actions.clearSearchResult]: {
      next: () => initalState,
      throw: state => state,
    },
    [actions.searchError]: {
      next: state => ({ ...state, searching: false }),
      throw: state => state,
    },
  },
  initalState,
);
