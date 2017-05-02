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

export default function* root() {
  yield all([
    ...searchSagas.map(s => spawn(s)),
    ...sessionSagas.map(s => spawn(s)),
  ]);
}
