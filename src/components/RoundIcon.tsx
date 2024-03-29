/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";

interface Props {
  icon?: ReactNode;
  open?: boolean;
  small?: boolean;
  smallIcon?: boolean;
  margin?: boolean;
}

const RoundIcon = ({ icon, ...rest }: Props) => <StyledRoundIcon {...rest}>{icon}</StyledRoundIcon>;

const StyledRoundIcon = styled.div<Omit<Props, "icon">>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
  border-radius: 50%;
  border: 1px solid;
  line-height: normal;
  background-color: white;

  > svg {
    height: ${spacing.nsmall};
    width: ${spacing.nsmall};
  }

  &:hover,
  &:focus {
    background-color: ${colors.brand.greyDark};
    color: ${colors.brand.greyLightest};
  }

  ${(props) =>
    props.open &&
    css`
      background-color: ${colors.brand.greyDark};
      color: ${colors.brand.greyLightest};
    `}

  ${(props) =>
    props.small &&
    css`
      height: 18px;
      width: 18px;
      min-width: 18px;
      margin-right: calc(${spacing.small} / 2);
    `}

  ${(props) =>
    props.smallIcon &&
    css`
      > svg {
        height: ${spacing.small};
        width: ${spacing.small};
      }
    `}

  ${(props) =>
    props.margin &&
    css`
      margin: 0 calc(${spacing.small} / 2);
    `}
`;

export default RoundIcon;
