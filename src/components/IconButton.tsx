/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, MouseEvent, HTMLProps } from 'react';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { css } from '@emotion/core';

interface StyledButtonProps {
  color?: keyof typeof colors.support;
  isDisabled?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  background: 0;
  border: 0;
  text-decoration: none;
  box-shadow: none;
  color: ${({ color }) => (color ? `${colors.support[color]}99` : colors.brand.tertiary)};
  width: ${spacing.normal};
  height: ${spacing.normal};

  svg {
    width: 22px;
    height: 22px;
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: ${spacing.normal};
    height: ${spacing.normal};
    background: ${({ color }) => (color ? `${colors.support[color]}4D` : colors.brand.lighter)};
    border-radius: 100%;
    transform: scale(0.5);
    opacity: 0;
    transition: all 200ms ease;
  }

  ${props =>
    !props.isDisabled &&
    css`
      &:hover,
      &:focus {
        color: ${props.color ? colors.support[props.color] : colors.brand.primary};
        &::before {
          transform: scale(1.25);
          opacity: 1;
        }
      }
    `}
`;

interface Props extends Omit<HTMLProps<HTMLButtonElement>, 'as'> {
  as?: ReactNode;
  to?: string;
  target?: string;
  title?: string;
  tabIndex?: number;
  onClick?: (event: MouseEvent) => void;
  type?: 'button' | 'reset' | 'submit';
  children: ReactNode;
  color?: 'red' | 'green';
  tag?: string | ReactNode;
  isDisabled?: boolean;
}

export const IconButton = ({ children, tag = 'button', ...rest }: Props) => (
  <StyledButton {...rest}>{children}</StyledButton>
);

export default IconButton;
