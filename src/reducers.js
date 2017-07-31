/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { combineReducers } from 'redux';

import locale from './modules/locale/locale';
import messages from './containers/Messages/messagesReducer';
import search from './containers/SearchPage/searchReducer';
import articles from './modules/article/article';
import tags from './modules/tag/tag';
import licenses from './modules/license/license';
import session from './modules/session/session';

const rootReducers = combineReducers({
  locale,
  messages,
  search,
  articles,
  tags,
  licenses,
  session,
});

export default rootReducers;
