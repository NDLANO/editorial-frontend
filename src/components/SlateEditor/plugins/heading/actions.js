/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { setBlock, insertParagraph } from './changes';

export function getCurrentHeading(options, state) {
  if (!state.selection.startKey) return null;
  const startBlock = state.startBlock;
  return startBlock && options.types.includes(startBlock.type)
    ? startBlock
    : null;
}

export function onEnter(evt, data, change, options) {
  const currentHeading = getCurrentHeading(options, change.state);
  if (!currentHeading) {
    return null;
  }
  evt.preventDefault();
  return insertParagraph(options, change);
}

export function onBackspace(evt, data, change, options) {
  const { state } = change;
  const { startOffset, isCollapsed } = state;
  const currentHeading = getCurrentHeading(options, state);
  if (!currentHeading || !isCollapsed) {
    return null;
  }
  if (startOffset === 0) {
    evt.preventDefault();
    return setBlock(options, change);
  }
  return null;
}
