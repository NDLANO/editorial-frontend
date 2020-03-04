/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  background: 0;
  border: 0;
  outline: none;
  text-decoration: none;
  box-shadow: none;
  color: ${props =>
    props.active ? colors.brand.primary : colors.brand.tertiary};
  width: ${spacing.normal};
  height: ${spacing.normal};

  svg {
    width: 22px;
    height: 22px;
    position: relative;
    pointer-events: none;
  }
`;

export const ToggleButton = ({ children, ...rest }) => (
  <StyledButton type="button" {...rest}>
    {children}
  </StyledButton>
);

ToggleButton.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default ToggleButton;
