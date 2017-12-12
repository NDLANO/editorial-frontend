/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

export const downShifhtSorter = (list, val, textField) =>
  list.filter(
    item =>
      item instanceof Object
        ? item[textField].toLowerCase().startsWith(val.toLowerCase())
        : item.toLowerCase().startsWith(val.toLowerCase()),
  );

export const valueFieldForItem = (item, valueField) => {
  if (item instanceof Object) {
    return item[valueField] || '';
  }
  return item;
};

export const itemToString = (item, field) => {
  if (!item) {
    return '';
  }
  return item instanceof Object ? item[field] : item;
};
