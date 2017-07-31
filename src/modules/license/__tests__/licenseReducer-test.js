/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { actions } from '../license';
import mockLicenses from './mockLicenses';

test('reducers/license initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    all: [],
    hasFetched: false,
  });
});

test('reducers/licenses setLicenses', () => {
  const nextState = reducer(undefined, actions.setLicenses(mockLicenses));

  expect(nextState).toEqual({
    all: mockLicenses,
    hasFetched: true,
  });
});
