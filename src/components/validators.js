/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const getLength = value => {
  if (value === undefined) {
    return 0;
  }

  if (value && value.document && value.selection) {
    return value.document.text.length;
  }
  return value.length;
};

export const isEmpty = value => {
  if (!value) {
    return true;
  } else if (Object.keys(value).length === 0 && value.constructor === Object) {
    return true;
  } else if (value && value.document) {
    return value.document.text.length === 0;
  }
  return false;
};

export const minLength = (value, length) => getLength(value) < length;
export const maxLength = (value, length) => getLength(value) > length;

export const minItems = (value, number) =>
  !value || (Array.isArray(value) && value.length < number);
