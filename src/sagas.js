/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { spawn, all } from 'redux-saga/effects';
import searchSagas from './containers/SearchPage/searchSagas';
import sessionSagas from './containers/App/sessionSagas';
import articleSagas from './containers/TopicArticlePage/articleSagas';
import tagSagas from './containers/Tag/tagSagas';
import imageSearchSagas from './containers/ImageSearch/imageSearchSagas';

export default function* root() {
  yield all([
    ...searchSagas.map(s => spawn(s)),
    ...sessionSagas.map(s => spawn(s)),
    ...articleSagas.map(s => spawn(s)),
    ...tagSagas.map(s => spawn(s)),
    ...imageSearchSagas.map(s => spawn(s)),
  ]);
}
