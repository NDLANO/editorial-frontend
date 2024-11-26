/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { colors, spacing, fonts } from "@ndla/core";

interface props {
  title: string;
  subTitle?: string;
  width?: number;
  children?: ReactNode;
}

interface StyledWrapperProps {
  wrapperWidth: number;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  align-items: center;
  border-bottom: 2px solid ${colors.brand.light};
  display: flex;
  padding-bottom: ${spacing.xsmall};
  padding-top: ${spacing.normal};
  ${(props) => css`
    width: ${props.wrapperWidth}%;
  `};
  > div {
    align-items: center;
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
  }
  button {
    background: 0;
    border: 0;
    margin: 0;
    padding: 0;
  }
`;

const StyledTitle = styled.h2`
  color: ${colors.text.primary};
  font-weight: ${fonts.weight.bold};
  margin: 0;
  padding-right: ${spacing.small};
  text-transform: uppercase;
  ${fonts.sizes(20, 1.1)};
  span {
    ${fonts.sizes(16, 1.1)};
    color: ${colors.text.light};
    font-weight: ${fonts.weight.normal};
    padding-left: ${spacing.small};
    text-transform: none;
  }
`;

const FieldHeader = ({ title, subTitle, width = 1, children }: props) => (
  <StyledWrapper wrapperWidth={width * 100}>
    <StyledTitle>
      {title}
      {!!subTitle && <span>{subTitle}</span>}
    </StyledTitle>
    <div>{children}</div>
  </StyledWrapper>
);

export default FieldHeader;
