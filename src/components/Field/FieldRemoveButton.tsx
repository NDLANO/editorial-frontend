/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithRef } from "react";
import styled from "@emotion/styled";
import { colors, spacing, fonts } from "@ndla/core";
import { Cross } from "@ndla/icons/action";

const StyledButton = styled.button`
  align-items: center;
  background: none;
  border: 0;
  cursor: pointer;
  display: flex;
  height: ${spacing.medium};
  justify-content: center;
  margin: 0;
  padding-top: ${spacing.small};
  span {
    box-shadow: inset 0 -1px;
    color: ${colors.brand.primary};
    font-weight: ${fonts.weight.semibold};
    ${fonts.sizes(16, 1.1)};
    padding-bottom: 2px;
  }
  [data-icon] {
    fill: ${colors.text.light};
    margin-right: ${spacing.small};
  }
  &:hover,
  &:focus {
    span {
      box-shadow: none;
    }
    [data-icon] {
      fill: ${colors.text.primary};
    }
  }
`;

const FieldRemoveButton = ({ children, type = "button", ...rest }: ComponentPropsWithRef<"button">) => (
  // eslint-disable-next-line react/button-has-type
  <StyledButton type={type} {...rest}>
    <Cross />
    <span>{children}</span>
  </StyledButton>
);

export default FieldRemoveButton;
