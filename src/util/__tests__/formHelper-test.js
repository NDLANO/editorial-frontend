/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Value } from 'slate';
import { parseCopyrightContributors, isFormDirty } from '../formHelper';
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

test('util/formHelper isFormDirty is true', () => {
  const fields = {
    someRandomField: { dirty: true, touched: false },
  };
  const initialModel = {};
  const model = {};
  expect(isFormDirty({ fields, model, initialModel })).toBe(true);
});

test('util/formHelper isFormDirty is false', () => {
  const fields = {
    content: { dirty: true, touched: false },
  };
  const initialModel = {
    content: [
      Value.fromJSON(valueWithTwoImageEmbeds),
      Value.fromJSON(valueWithInlineFootnotesAndContentLinks),
    ],
  };
  const model = {
    content: [
      Value.fromJSON(valueWithTwoImageEmbeds),
      Value.fromJSON(valueWithInlineFootnotesAndContentLinks),
    ],
  };
  expect(isFormDirty({ fields, model, initialModel })).toBe(false);
});

test('util/formHelper isFormDirty content sections is removed', () => {
  const fields = {
    content: { dirty: true, touched: false },
  };
  const initialModel = {
    content: [
      Value.fromJSON(valueWithTwoImageEmbeds),
      Value.fromJSON(valueWithInlineFootnotesAndContentLinks),
    ],
  };
  const model = {
    content: [Value.fromJSON(valueWithTwoImageEmbeds)],
  };
  expect(isFormDirty({ fields, model, initialModel })).toBe(true);
});

test('util/formHelper parseCopyrightContributors', () => {
  expect(
    parseCopyrightContributors({ copyright: { creators } }, 'creators'),
  ).toEqual(creators);
});

test('util/formHelper parseCopyrightContributors type not found', () => {
  expect(
    parseCopyrightContributors({ copyright: { creators } }, 'test'),
  ).toEqual([]);
});

test('util/formHelper parseCopyrightContributors no copyright object', () => {
  expect(parseCopyrightContributors({}, 'fotograf')).toEqual([]);
});
