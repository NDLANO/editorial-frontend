/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import createSlateStore from '../createSlateStore';

const store = createSlateStore();

test('slateStore initalState', () => {
  expect(store.getState()).toEqual({
    submitted: false,
  });
});

test('slateStore set submitted', () => {
  store.dispatch({
    type: 'SET_SUBMITTED',
    payload: true,
  });

  expect(store.getState()).toEqual({
    submitted: true,
  });
});
