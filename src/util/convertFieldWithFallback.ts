/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

type LangObj<F extends string, R> = { [key in F]: R } & { language: string };
type Element<F extends string, R> = { [key in F]?: R | LangObj<F, R> };

export function convertFieldWithFallback<Key extends string, ReturnType = string>(
  element: Element<Key, ReturnType>,
  fieldName: Key,
  fallback: ReturnType,
  language?: string,
): ReturnType {
  const elementField = element[fieldName];
  if (elementField === null || elementField === undefined) {
    return fallback;
  }

  if (typeof elementField !== 'object' || Array.isArray(elementField)) {
    return elementField as ReturnType;
  }

  const langObj = elementField as LangObj<Key, ReturnType>;

  if (language) {
    return langObj.language === language ? langObj[fieldName] : fallback;
  }

  return langObj[fieldName];
}
