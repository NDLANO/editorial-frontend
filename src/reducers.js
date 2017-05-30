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
import articles from './containers/TopicArticlePage/articleDucks';
import tags from './containers/Tag/tagDucks';
import imageSearch from './containers/ImageSearch/imageReducer';
import authenticated from './reducers/authenticated';
import idToken from './reducers/idToken';
import user from './reducers/user';

const rootReducers = combineReducers({
  locale,
  messages,
  search,
  articles,
  tags,
  imageSearch,
  authenticated,
  idToken,
  user,
});

export default rootReducers;
