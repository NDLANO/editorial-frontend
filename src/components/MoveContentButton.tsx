/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { IconButtonV2 } from "@ndla/button";
import { ChevronLeft } from "@ndla/icons/common";

interface Props extends ComponentProps<typeof IconButtonV2> {}

export const MoveContentButton = ({ onMouseDown, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <IconButtonV2
      contentEditable={false}
      tabIndex={-1}
      variant="ghost"
      onMouseDown={onMouseDown}
      title={rest["aria-label" ?? ""]}
      {...rest}
      aria-label={rest["aria-label" ?? ""]}
    >
      <ChevronLeft />
    </IconButtonV2>
  );
};

export default MoveContentButton;
