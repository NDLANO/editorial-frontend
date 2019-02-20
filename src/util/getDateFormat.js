/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NORWEGIAN_FORMAT, ENGLISH_FORMAT } from '../constants';

export function getDateFormat(locale) {
  if (locale === 'en') {
    return ENGLISH_FORMAT;
  }
  return NORWEGIAN_FORMAT;
}
