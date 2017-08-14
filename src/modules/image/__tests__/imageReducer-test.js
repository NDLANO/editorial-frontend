/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { actions } from '../image';

test('reducers/image initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toMatchSnapshot();
});

test('reducers/image set image', () => {
  const nextState = reducer(undefined, {
    type: actions.setImage,
    payload: { id: 1, title: 'Unit test' },
  });

  expect(nextState).toMatchSnapshot();
});

test('reducers/image set multiple image', () => {
  const state = reducer(undefined, {
    type: actions.setImage,
    payload: { id: 1, title: 'Unit test 1' },
  });
  const nextState = reducer(state, {
    type: actions.setImage,
    payload: { id: 2, title: 'Unit test 2' },
  });

  expect(nextState).toMatchSnapshot();
});

test('reducers/image overwrite image with same id', () => {
  const nextState = reducer(
    {
      all: {
        1: { id: 1, title: 'Unit test 1' },
      },
    },
    { type: actions.setImage, payload: { id: 1, title: 'Unit test 2' } },
  );

  expect(nextState).toMatchSnapshot();
});

test('reducers/image sets isSaving to true on update', () => {
  const nextState = reducer(undefined, {
    type: actions.updateImage,
    payload: undefined,
  });

  expect(nextState).toMatchSnapshot();
});

test('reducers/image sets isSaving to false on update error', () => {
  const nextState = reducer(
    { isSaving: true },
    { type: actions.updateImageError, payload: undefined },
  );

  expect(nextState).toMatchSnapshot();
});

test('reducers/image sets isSaving to false on update success', () => {
  const nextState = reducer(
    { isSaving: true },
    { type: actions.updateImageuccess, payload: undefined },
  );

  expect(nextState).toMatchSnapshot();
});
