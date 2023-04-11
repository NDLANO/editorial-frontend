/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const arrMove = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  if (fromIndex === toIndex) {
    return array;
  }
  const copy = [...array];
  const item = copy.splice(fromIndex, 1)[0];
  copy.splice(toIndex, 0, item);
  return copy;
};
