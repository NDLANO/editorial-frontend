/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatTagToList } from '../AsyncSearchTags';

test('csv/string input is correctly returned', () => {
  expect(formatTagToList('tag2, tag3', ['tag1'])).toStrictEqual(['tag1', 'tag2', 'tag3']);
  expect(formatTagToList('tag2, tag1', ['tag1'])).toStrictEqual(['tag1', 'tag2']);
  expect(formatTagToList('tag2, tag3, tag3', ['tag1'])).toStrictEqual(['tag1', 'tag2', 'tag3']);
  expect(formatTagToList('tag2', ['tag1'])).toStrictEqual(['tag1', 'tag2']);
});
