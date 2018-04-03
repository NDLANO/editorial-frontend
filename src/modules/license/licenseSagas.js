/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import * as api from '../draft/draftApi';
import { actions, getHasFetched } from './license';

export function* fetchLicenses() {
  try {
    const licenses = yield call(api.fetchLicenses);
    yield put(actions.setLicenses(licenses));
  } catch (error) {
    // TODO: handle error
    console.error(error); // eslint-disable-line no-console
  }
}

export function* watchFetchLicenses() {
  while (true) {
    yield take(actions.fetchLicenses);
    const hasFetched = yield select(getHasFetched);
    if (!hasFetched) {
      yield call(fetchLicenses);
    }
  }
}

export default [watchFetchLicenses];
