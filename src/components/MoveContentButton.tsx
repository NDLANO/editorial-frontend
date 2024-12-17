/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArrowLeftShortLine } from "@ndla/icons";
import { IconButton, IconButtonProps } from "@ndla/primitives";

export const MoveContentButton = ({ onMouseDown, ...rest }: IconButtonProps) => {
  return (
    <IconButton
      contentEditable={false}
      tabIndex={-1}
      variant="secondary"
      size="small"
      onMouseDown={onMouseDown}
      title={rest["aria-label"]}
      {...rest}
      aria-label={rest["aria-label"]}
    >
      <ArrowLeftShortLine />
    </IconButton>
  );
};

export default MoveContentButton;
