/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { convertFieldWithFallback } from '../convertFieldWithFallback';

const article = {
  id: '2',
  created: '2014-12-24T10:44:06Z',
  title: { title: 'Tester', language: 'nb' },
  tags: { tags: ['apekatt', 'eplekjekk'], language: 'nb' },
};

test('typescript: convertFieldWithFallback convert field title to string', () => {
  const obj = convertFieldWithFallback<'title', string>(article, 'title', '');
  expect(obj).toEqual('Tester');
});

test('typescript: convertFieldWithFallback converts string[] fields', () => {
  const obj = convertFieldWithFallback<'tags', string[]>(article, 'tags', [], 'nb');
  expect(obj).toEqual(['apekatt', 'eplekjekk']);
});

test('typescript: convertFieldWithFallback falls back if wrong language', () => {
  const obj = convertFieldWithFallback<'tags', string[]>(
    article,
    'tags',
    ['english', 'tags'],
    'en',
  );
  expect(obj).toEqual(['english', 'tags']);
});
