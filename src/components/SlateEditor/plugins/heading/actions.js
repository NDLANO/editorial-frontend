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
  if (!value.selection.start.key) return null;
  const { startBlock } = value;
  return startBlock && options.types.includes(startBlock.type)
    ? startBlock
    : null;
}

export function onEnter(evt, value, options, editor, next) {
  const currentHeading = getCurrentHeading(options, value);
  if (!currentHeading) {
    return next();
  }
  evt.preventDefault();
  return insertParagraph(options, editor);
}

export function onBackspace(evt, value, options, editor, next) {
  const { start, isCollapsed } = value.selection;
  const currentHeading = getCurrentHeading(options, value, next);
  if (!currentHeading || !isCollapsed) {
    return next();
  }
  if (start.offset === 0) {
    evt.preventDefault();
    return setBlock(options, editor);
  }
  return next();
}
