/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import formatDate from '../formatDate';

test('util/formatDate to norwegian format', () => {
  expect(formatDate('2014-12-24T10:44:06Z')).toBe('24.12.2014');
  expect(formatDate('1978-03-07T15:00:00Z')).toBe('07.03.1978');
});
