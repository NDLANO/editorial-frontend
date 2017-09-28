/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

export function setBlock(options, change) {
  return change.setBlock(options.defaultType);
}

export function insertParagraph(options, change) {
  return change.insertBlock(options.defaultType);
}
