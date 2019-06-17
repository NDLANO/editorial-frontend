/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// swapping array elements
export function arrMove(array, fromIndex, toIndex) {
  const item = array[fromIndex];
  const length = array.length;
  const diff = fromIndex - toIndex;

  if (diff > 0) {
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, fromIndex),
      ...array.slice(fromIndex + 1, length),
    ];
  } else if (diff < 0) {
    const targetIndex = toIndex + 1;
    return [
      ...array.slice(0, fromIndex),
      ...array.slice(fromIndex + 1, targetIndex),
      item,
      ...array.slice(targetIndex, length),
    ];
  }
  return array;
}
