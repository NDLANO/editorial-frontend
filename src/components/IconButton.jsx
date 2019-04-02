/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';

export const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  background: 0;
  border: 0;
  text-decoration: none;
  box-shadow: none;
  color: ${({ color }) =>
    color ? `${colors.support[color]}99` : colors.brand.tertiary};
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
    background: ${({ color }) =>
      color ? `${colors.support[color]}4D` : colors.brand.lighter};
    border-radius: 100%;
    transform: scale(0.5);
    opacity: 0;
    transition: all 200ms ease;
  }

  &:hover,
  &:focus {
    color: ${({ color }) =>
      color ? `${colors.support[color]}` : colors.brand.primary};

    &::before {
      transform: scale(1.25);
      opacity: 1;
    }
  }
`;

export const IconButton = ({ children, ...rest }) => (
  <StyledButton {...rest}>{children}</StyledButton>
);

IconButton.propTypes = {
  color: PropTypes.oneOf(['red', 'green']),
  tag: PropTypes.string,
};

IconButton.defaultProps = {
  tag: 'button',
};

export default IconButton;
