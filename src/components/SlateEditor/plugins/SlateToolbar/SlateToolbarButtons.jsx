/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Button } from 'ndla-ui';

export function renderMarkButton(type, icon, handleHasMark, handleOnClickMark) {
  const isActive = handleHasMark(type);
  const onMouseDown = e => handleOnClickMark(e, type);

  return (
    <Button stripped onMouseDown={onMouseDown} data-active={isActive}>
      <span className="c-toolbar__icon">
        {icon}
      </span>
    </Button>
  );
}
export function renderBlockButton(
  type,
  icon,
  handleHasBlock,
  handleOnClickBlock,
) {
  const isActive = handleHasBlock(type);
  const onMouseDown = e => handleOnClickBlock(e, type);

  return (
    <Button stripped onMouseDown={onMouseDown} data-active={isActive}>
      <span className="c-toolbar__icon">
        {icon}
      </span>
    </Button>
  );
}
