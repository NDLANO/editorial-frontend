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
  const item = array[fromIndex];

  return array.reduce<T[]>((acc, curr, i) => {
    if (i === fromIndex) {
      return acc;
    } else if (i === toIndex) {
      return acc.concat(curr).concat(item);
    }
    return acc.concat(curr);
  }, []);
};
