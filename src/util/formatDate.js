/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import isString from 'lodash/isString';

const NORWEGIAN_FORMAT = 'dd.MM.yyyy';

export default function formatDate(date) {
  if (!date) {
    return date;
  }

  if (isString(date)) {
    const parsedDate = parseISO(date);
    return format(parsedDate, NORWEGIAN_FORMAT);
  }

  return format(date, NORWEGIAN_FORMAT);
}
