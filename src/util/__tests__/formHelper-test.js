/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { parseCopyrightContributors, isFormikFormDirty } from '../formHelper';
import {
  valueWithTwoImageEmbeds,
  valueWithInlineFootnotesAndContentLinks,
} from './slateMockValues';

const creators = [
  { name: 'test', type: 'writer' },
  { name: 'test3', type: 'writer' },
  { name: 'test2', type: 'writer' },
  { name: 'test2', type: 'writer' },
];

test('util/formHelper isFormikFormDirty is true', () => {
  const initialValues = {
    someRandomField: '',
  };
  const values = {
    someRandomField: 'This is a test',
  };
  expect(isFormikFormDirty({ dirty: true, values, initialValues })).toBe(true);
});

test('util/formHelper isFormDirty is false', () => {
  const initialValues = {
    articleType: 'standard',
    content: [valueWithTwoImageEmbeds, valueWithInlineFootnotesAndContentLinks],
  };
  const values = {
    content: [valueWithTwoImageEmbeds, valueWithInlineFootnotesAndContentLinks],
  };
  expect(
    isFormikFormDirty({
      dirty: true,
      values,
      initialValues,
    }),
  ).toBe(false);
});

test('util/formHelper isFormikFormDirty content sections is removed', () => {
  const initialValues = {
    articleType: 'standard',
    content: [valueWithTwoImageEmbeds, valueWithInlineFootnotesAndContentLinks],
  };
  const values = {
    content: [valueWithTwoImageEmbeds],
  };
  expect(
    isFormikFormDirty({
      dirty: true,
      values,
      initialValues,
    }),
  ).toBe(true);
});

test('util/formHelper parseCopyrightContributors', () => {
  expect(parseCopyrightContributors({ copyright: { creators } }, 'creators')).toEqual(creators);
});

test('util/formHelper parseCopyrightContributors type not found', () => {
  expect(parseCopyrightContributors({ copyright: { creators } }, 'test')).toEqual([]);
});

test('util/formHelper parseCopyrightContributors no copyright object', () => {
  expect(parseCopyrightContributors({}, 'fotograf')).toEqual([]);
});
