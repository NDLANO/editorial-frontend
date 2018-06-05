/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function convertFieldWithFallback(element, field, fallback, language) {
  if (language) {
    return element[field] && element[field].language === language
      ? element[field][field]
      : fallback;
  }

  return typeof element[field] === 'object' && element[field] !== null
    ? element[field][field]
    : fallback;
}
