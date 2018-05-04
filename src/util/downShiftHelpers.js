/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { get } from 'lodash';

export const downShiftSorter = (list, val, textField) =>
  list.filter(item => {
    let textValue;
    if (item instanceof Object) {
      textValue = item[textField];
    } else {
      textValue = item;
    }
    return !textValue || textValue.toLowerCase().startsWith(val.toLowerCase());
  });

export const valueFieldForItem = (item, valueField) => {
  if (item instanceof Object) {
    return item[valueField] || '';
  }
  return item;
};

export const itemToString = (item, field) => (item ? get(item, field, '') : '');
