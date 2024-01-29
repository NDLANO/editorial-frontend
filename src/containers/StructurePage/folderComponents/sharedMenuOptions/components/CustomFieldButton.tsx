/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";

const StyledCustomFieldButton = styled(ButtonV2)`
  &,
  &:disabled {
    height: 24px;
    width: 24px;
    min-width: 24px;
    min-height: 24px;
    background-color: ${colors.brand.greyDark};
    border-color: ${colors.brand.greyDark};
    padding: 0;
    line-height: 16.9px;
  }
`;

interface Props {
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  "data-testid"?: string;
}

const CustomFieldButton = ({ children, ...rest }: Props) => {
  return <StyledCustomFieldButton {...rest}>{children}</StyledCustomFieldButton>;
};

export default CustomFieldButton;
