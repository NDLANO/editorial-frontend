/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { actions } from '../audio';

test('reducers/audio initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toMatchSnapshot();
});

test('reducers/audio set audio', () => {
  const nextState = reducer(undefined, {
    type: actions.setAudio,
    payload: { id: 1, title: 'Unit test' },
  });

  expect(nextState).toMatchSnapshot();
});

test('reducers/audio set multiple audio', () => {
  const state = reducer(undefined, {
    type: actions.setAudio,
    payload: { id: 1, title: 'Unit test 1' },
  });
  const nextState = reducer(state, {
    type: actions.setAudio,
    payload: { id: 2, title: 'Unit test 2' },
  });

  expect(nextState).toMatchSnapshot();
});

test('reducers/audio overwrite audio with same id', () => {
  const nextState = reducer(
    {
      all: {
        1: { id: 1, title: 'Unit test 1' },
      },
    },
    { type: actions.setAudio, payload: { id: 1, title: 'Unit test 2' } },
  );

  expect(nextState).toMatchSnapshot();
});

test('reducers/audio sets isSaving to true on update', () => {
  const nextState = reducer(undefined, {
    type: actions.updateAudio,
    payload: undefined,
  });

  expect(nextState).toMatchSnapshot();
});

test('reducers/audio sets isSaving to false on update error', () => {
  const nextState = reducer(
    { isSaving: true },
    { type: actions.updateAudioError, payload: undefined },
  );

  expect(nextState).toMatchSnapshot();
});

test('reducers/audio sets isSaving to false on update success', () => {
  const nextState = reducer(
    { isSaving: true },
    { type: actions.updateAudiouccess, payload: undefined },
  );

  expect(nextState).toMatchSnapshot();
});
