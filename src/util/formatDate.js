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
import { getDateFormat } from './getDateFormat';

export default function formatDate(date, locale) {
  if (!date) {
    return date;
  }

  if (isString(date)) {
    const parsedDate = parseISO(date);
    return format(parsedDate, getDateFormat(locale));
  }
  return format(date, getDateFormat(locale));
}
