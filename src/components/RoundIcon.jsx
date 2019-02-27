/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import { colors, spacing } from '@ndla/core';

const RoundIcon = ({ icon, ...rest }) => (
  <StyledRoundIcon {...rest}>{icon}</StyledRoundIcon>
);

const StyledRoundIcon = styled.div`
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
    height: 20px;
    width: 20px;
  }

  &:hover,
  &:focus {
    background-color: ${colors.brand.greyDark};
    color: ${colors.brand.greyLightest};
  }

  ${props =>
    props.open &&
    css`
      background-color: ${colors.brand.greyDark};
      color: ${colors.brand.greyLightest};
    `}

  ${props =>
    props.small &&
    css`
      height: 18px;
      width: 18px;
      min-width: 18px;
      margin-right: calc(${spacing.small} / 2);
    `}

  ${props =>
    props.margin &&
    css`
      margin: 0 calc(${spacing.small} / 2);
    `}
`;

RoundIcon.propTypes = {
  icon: PropTypes.node,
  open: PropTypes.bool,
  small: PropTypes.bool,
  margin: PropTypes.bool,
};

export default RoundIcon;
