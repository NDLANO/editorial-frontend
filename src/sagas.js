/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { spawn, all } from 'redux-saga/effects';
import imageSagas from './modules/image/imageSagas';
import tagSagas from './modules/tag/tagSagas';
import licenseSagas from './modules/license/licenseSagas';
import messagesSagas from './containers/Messages/messagesSagas';

export default function* root() {
  yield all([
    ...imageSagas.map(s => spawn(s)),
    ...tagSagas.map(s => spawn(s)),
    ...licenseSagas.map(s => spawn(s)),
    ...messagesSagas.map(s => spawn(s)),
  ]);
}
