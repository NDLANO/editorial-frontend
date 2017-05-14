/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const getLength = (value) => {
  if (value && value.getCurrentContent) {
    return value.getCurrentContent().getPlainText().length;
  }
  return value.length;
};

export const isEmpty = (value) => {
  if (!value) {
    return true;
  } else if (value && value.getCurrentContent && !value.getCurrentContent().hasText()) { // Draftjs check
    return true;
  }
  return false;
};

export const minLength = (value, length) => !value || getLength(value) < length;
export const maxLength = (value, length) => !value || getLength(value) > length;

export const minItems = (value, number) => !value || (Array.isArray(value) && value.length < number);
