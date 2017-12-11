/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { setBlock, insertParagraph } from './changes';

export function getCurrentHeading(options, value) {
  if (!value.selection.startKey) return null;
  const startBlock = value.startBlock;
  return startBlock && options.types.includes(startBlock.type)
    ? startBlock
    : null;
}

export function onEnter(evt, value, options, change) {
  const currentHeading = getCurrentHeading(options, value);
  if (!currentHeading) {
    return null;
  }
  evt.preventDefault();
  return insertParagraph(options, change);
}

export function onBackspace(evt, value, options, change) {
  const { startOffset, isCollapsed } = value;
  const currentHeading = getCurrentHeading(options, value);
  if (!currentHeading || !isCollapsed) {
    return null;
  }
  if (startOffset === 0) {
    evt.preventDefault();
    return setBlock(options, change);
  }
  return null;
}
