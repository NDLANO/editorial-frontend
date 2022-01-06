/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isGrepCodeValid } from '../articleUtil';

test('isGrepCodeValid correct behavior', () => {
  const grepCodes = new Map();
  grepCodes.set('KE1337', true);
  grepCodes.set('KM2255', true);
  grepCodes.set('TT3', true);
  grepCodes.set('TT9898', true);
  grepCodes.set('TTR13', false);
  grepCodes.set('TT12KE1337', false);
  grepCodes.set('KE1337TT12', false);
  grepCodes.set('K1', false);
  grepCodes.set('K123', false);
  grepCodes.set('KV5432', false);
  grepCodes.set('KJ12', false);
  grepCodes.set('1K123', false);
  grepCodes.set('K3K', false);
  grepCodes.set('k123', false);

  grepCodes.forEach((value, key) => expect(isGrepCodeValid(key)).toBe(value));
});
