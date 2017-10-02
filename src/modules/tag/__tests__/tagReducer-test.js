/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { actions } from '../tag';
import { nn } from './mockTags';

test('reducers/tags initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    all: {},
  });
});

test('reducers/tags setTags', () => {
  const nextState = reducer(undefined, actions.setTags(nn));

  expect(nextState).toEqual({
    all: {
      nn: {
        ...nn[0],
        hasFetched: true,
      },
    },
  });
});
