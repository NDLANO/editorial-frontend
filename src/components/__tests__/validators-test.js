/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Plain } from 'slate';
import { isEmpty, minLength, maxLength, minItems } from '../validators';

test('validators/isEmpty returns true when empty', () => {
  expect(isEmpty(undefined)).toBe(true);
  expect(isEmpty('')).toBe(true);
  expect(isEmpty({})).toBe(true);
  expect(isEmpty(Plain.deserialize(''))).toBe(true);
});

test('validators/isEmpty returns false when not empty', () => {
  expect(isEmpty('Something')).toBe(false);
  expect(isEmpty({ has: 'something' })).toBe(false);
  expect(isEmpty(Plain.deserialize('Something'))).toBe(false);
});

test('validators/maxLength returns true if value exceed length', () => {
  expect(maxLength('Something', 8)).toBe(true);
  expect(maxLength(Plain.deserialize('Something'), 8)).toBe(true);
});

test('validators/maxLength returns false if value does not exceed length', () => {
  expect(maxLength(undefined)).toBe(false);
  expect(maxLength('Something', 9)).toBe(false);
  expect(maxLength(Plain.deserialize('Something'), 9)).toBe(false);
});

test('validators/minLength returns true if value does not exceed length', () => {
  expect(minLength('Something', 10)).toBe(true);
  expect(minLength(Plain.deserialize('Something'), 10)).toBe(true);
});

test('validators/minLength returns false if value exceed length', () => {
  expect(minLength(undefined)).toBe(false);
  expect(minLength('Something', 9)).toBe(false);
  expect(isEmpty(Plain.deserialize('Something'), 9)).toBe(false);
});

test('validators/minItems check number of items', () => {
  expect(minItems(['val1', 'val2', 'val3'], 3)).toBe(false);
  expect(minItems(['val1', 'val2'], 3)).toBe(true);
  expect(minItems(undefined, 3)).toBe(true);
});
