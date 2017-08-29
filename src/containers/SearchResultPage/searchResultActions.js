/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';

export const search = createAction('SEARCH');
export const searchError = createAction('SEARCH_ERROR');
export const clearSearchResult = createAction('CLEAR_SEARCH_RESULT');
export const setSearchResult = createAction('SET_SEARCH_RESULT');
