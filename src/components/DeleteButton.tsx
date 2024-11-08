/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DeleteBinLine } from "@ndla/icons/action";
import { IconButton, type IconButtonProps } from "@ndla/primitives";

export const DeleteButton = ({ children, ...rest }: IconButtonProps) => (
  <IconButton
    variant="danger"
    size="small"
    tabIndex={-1}
    contentEditable={false}
    data-testid="close-related-button"
    title={rest["aria-label" ?? ""]}
    {...rest}
    aria-label={rest["aria-label" ?? ""]}
  >
    <DeleteBinLine />
  </IconButton>
);

export default DeleteButton;
