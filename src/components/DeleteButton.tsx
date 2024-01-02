/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps } from "react";
import { IconButtonV2 } from "@ndla/button";
import { DeleteForever } from "@ndla/icons/editor";
import Tooltip from "@ndla/tooltip";

interface Props extends ComponentProps<typeof IconButtonV2> {}

export const DeleteButton = ({ children, ...rest }: Props) => (
  <Tooltip tooltip={rest["aria-label" ?? ""]}>
    <IconButtonV2
      colorTheme="danger"
      variant="ghost"
      contentEditable={false}
      data-testid="close-related-button"
      {...rest}
    >
      <DeleteForever />
    </IconButtonV2>
  </Tooltip>
);

export default DeleteButton;
