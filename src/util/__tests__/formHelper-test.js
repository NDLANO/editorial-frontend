/**
* Copyright (c) 2016-present, NDLA.
*
* This source code is licensed under the GPLv3 license found in the
* LICENSE file in the root directory of this source tree. *
*/

import { parseCopyrightContributors } from '../formHelper';

const creators = [
  { name: 'test', type: 'writer' },
  { name: 'test3', type: 'writer' },
  { name: 'test2', type: 'writer' },
  { name: 'test2', type: 'writer' },
];

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
