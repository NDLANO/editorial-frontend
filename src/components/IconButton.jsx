/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
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
  color: ${props => {
    if (props.color === 'red') {
      return `${colors.support.red}99`;
    }
    if (props.color === 'green') {
      return `${colors.support.green}99`;
    }
    return colors.brand.tertiary;
  }};
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
    background: ${props => {
      if (props.color === 'red') {
        return `${colors.support.red}4D`;
      }
      if (props.color === 'green') {
        return `${colors.support.green}4D`;
      }
      return colors.brand.lighter;
    }};
    border-radius: 100%;
    transform: scale(0.5);
    opacity: 0;
    transition: all 200ms ease;
  }

  &:hover,
  &:focus {
    color: ${props => {
      if (props.color === 'red') {
        return colors.support.red;
      }
      if (props.color === 'green') {
        return colors.support.green;
      }
      return colors.brand.primary;
    }};
    &::before {
      transform: scale(1.25);
      opacity: 1;
    }
  }
`;

export const IconButton = ({ children, tag, ...rest }) => {
  const WithButton = StyledButton.withComponent(tag);
  return <WithButton {...rest}>{children}</WithButton>;
};

IconButton.propTypes = {
  color: PropTypes.oneOf(['red', 'green']),
  tag: PropTypes.string,
};

IconButton.defaultProps = {
  tag: 'button',
};

export default IconButton;
