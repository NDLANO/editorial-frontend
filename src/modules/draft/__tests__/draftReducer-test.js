/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { actions } from '../draft';

test('reducers/articles initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toMatchSnapshot();
});

test('reducers/articles set article', () => {
  const nextState = reducer(undefined, {
    type: actions.setDraft,
    payload: { id: 1, title: 'Unit test' },
  });

  expect(nextState).toMatchSnapshot();
});

test('reducers/articles set multiple articles', () => {
  const state = reducer(undefined, {
    type: actions.setDraft,
    payload: { id: 1, title: 'Unit test 1' },
  });
  const nextState = reducer(state, {
    type: actions.setDraft,
    payload: { id: 2, title: 'Unit test 2' },
  });

  expect(nextState).toMatchSnapshot();
});

test('reducers/article overwrite articles with same id', () => {
  const nextState = reducer(
    {
      all: {
        1: { id: 1, title: 'Unit test 1' },
      },
    },
    { type: actions.setDraft, payload: { id: 1, title: 'Unit test 2' } },
  );

  expect(nextState).toMatchSnapshot();
});

test('reducers/article sets isSaving to true on update', () => {
  const nextState = reducer(undefined, {
    type: actions.updateDraft,
    payload: undefined,
  });

  expect(nextState).toMatchSnapshot();
});

test('reducers/article sets isSaving to false on update error', () => {
  const nextState = reducer(
    { isSaving: true },
    { type: actions.updateDraftError, payload: undefined },
  );

  expect(nextState).toMatchSnapshot();
});

test('reducers/article sets isSaving to false on update success', () => {
  const nextState = reducer(
    { isSaving: true },
    { type: actions.updateDraftSuccess, payload: undefined },
  );

  expect(nextState).toMatchSnapshot();
});
