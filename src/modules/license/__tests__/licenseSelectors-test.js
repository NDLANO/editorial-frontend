/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getAllLicenses, getHasFetched } from '../license';
import mockLicenses from './mockLicenses';

const state = {
  locale: 'zh',
  licenses: {
    hasFetched: true,
    all: mockLicenses,
  },
};

test('licenseSelector getAllLicenses', () => {
  expect(getAllLicenses(state).length).toBe(15);
});

test('licenseSelector getHasFetched', () => {
  expect(getHasFetched(state)).toBe(true);
});
