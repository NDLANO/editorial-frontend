/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { combineReducers } from 'redux';

import locale from './containers/Locale/localeReducer';
import messages from './containers/Messages/messagesReducer';
import search from './containers/SearchPage/searchReducer';
import accessToken from './containers/App/sessionReducer';

const rootReducers = combineReducers({
  accessToken,
  locale,
  messages,
  search,
});

export default rootReducers;
