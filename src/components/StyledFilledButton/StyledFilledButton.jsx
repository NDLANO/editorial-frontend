/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, spacing, fonts, misc } from '@ndla/core';

const StyledFilledButton = styled.button`
  display: flex;
  padding: ${spacing.xsmall} ${spacing.small};
  background: transparent;
  box-shadow: none;
  border: 0;
  color: ${colors.brand.primary};
  font-family: ${fonts.sans};
  ${fonts.sizes(16, 1.1)};
  font-weight: ${fonts.weight.semibold};
  white-space: nowrap;
  border-radius: ${misc.borderRadius};
  transition: all 200ms ease;
  cursor: pointer;
  .c-icon {
    width: 16px;
    height: 16px;
    margin: 0 3px 0 -3px;
    ${props =>
      props.deletable &&
      css`
        color: ${colors.support.red};
      `}
  }
  &:focus,
  &:hover {
    color: #fff;
    background: ${colors.brand.primary};
    ${props =>
      props.deletable &&
      !props.disabled &&
      css`
        background: ${colors.support.red};
      `}
    transform: translate(1px, 1px);
    .c-icon {
      color: #fff;
    }
  }
  &:disabled {
    background: ${colors.brand.greyLight};
    color: ${colors.brand.grey};
    cursor: not-allowed;
    pointer-events: auto;
    transform: translate(0px, 0px);
    .c-icon {
      color: ${colors.support.red};
    }
  }
`;

export default StyledFilledButton;
