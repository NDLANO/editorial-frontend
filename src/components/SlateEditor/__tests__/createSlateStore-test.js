/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import createSlateStore, {
  setActiveNode,
  setSubmitted,
} from '../createSlateStore';

test('slateStore initalState', () => {
  const store = createSlateStore();
  expect(store.getState()).toEqual({
    submitted: false,
  });
});

test('slateStore set submitted', () => {
  const store = createSlateStore();
  store.dispatch(setSubmitted(true));

  expect(store.getState()).toEqual({
    submitted: true,
  });
});

test('slateStore set footnote', () => {
  const store = createSlateStore();
  store.dispatch(setActiveNode({ type: 'footnote' }));

  expect(store.getState()).toEqual({
    submitted: false,
    activeNode: { type: 'footnote' },
  });
});
