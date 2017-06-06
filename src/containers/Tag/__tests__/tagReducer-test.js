/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { actions } from '../tagDucks';
import mockTags from './mockTags';

test('reducers/tags initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    all: [],
    hasFetched: false,
  });
});

test('reducers/tags setTags', () => {
  const nextState = reducer(undefined, actions.setTags(mockTags));

  expect(nextState).toEqual({
    all: mockTags,
    hasFetched: true,
  });
});
