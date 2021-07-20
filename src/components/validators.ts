/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Value } from 'slate';

const rUrl = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i; //eslint-disable-line

export const getLength = (value: string | undefined | null | Value): number => {
  if (!value) {
    return 0;
  }

  if (value && value instanceof Value) {
    return value.document.text.length;
  }
  return value.length;
};

export const isEmpty = (value: null | undefined | object | string | Value) => {
  if (!value) {
    return true;
  }
  if (Object.keys(value).length === 0 && value.constructor === Object) {
    return true;
  }
  if (value instanceof Value && value.document) {
    return value.document.text.length === 0;
  }
  return false;
};

export const isUrl = (value: string) => {
  if (!isEmpty(value)) {
    return rUrl.test(value);
  }
  return false;
};

export const validDateRange = (before: string | number | Date, after: string | number | Date) => {
  const beforeDate = new Date(before);
  const afterDate = new Date(after);
  return beforeDate.getTime() <= afterDate.getTime();
};

export const minLength = (value: string | undefined | null | Value, length: number) =>
  getLength(value) < length;
export const maxLength = (value: string | undefined | null | Value, length: number) =>
  getLength(value) > length;

export const minItems = (value: undefined | null | [], number: number) =>
  !value || (Array.isArray(value) && value.length < number);

//  https://stackoverflow.com/a/1830844
export const isNumeric = (value: any) => !Number.isNaN(value - parseFloat(value));

export const objectHasBothField = (obj: Record<string, any>) =>
  Object.keys(obj).filter(key => isEmpty(obj[key])).length === 0;
