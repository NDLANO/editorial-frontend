/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { spacing, colors } from '@ndla/core';

const ToggleSwitch = ({
  on,
  onClick,
  testId,
  large,
  contentLabelOff,
  contentLabelOn,
}) => (
  <StyledLabel
    data-testid={testId}
    large={large}
    contentLabelOn={contentLabelOn}>
    <input checked={on} onChange={onClick} type="checkbox" />
    <StyledSlider large={large} contentLabelOff={contentLabelOff} />
  </StyledLabel>
);

const StyledSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 22px;
  background-color: white;
  border: 0.63px solid #a9a9a9;
  transition: 0.4s;
  border-radius: 10px;

  ${props =>
    props.large &&
    css`
      height: 26px;
      border-radius: 13px;

      &::before {
        height: 26px;
        width: 26px;
      }
    `}

  &::before {
    position: absolute;
    content: '${props => props.contentLabelOff}';
    left: -3px;
    top: -0.63px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 22px;
    width: 22px;
    background-color: ${colors.brand.grey};
    color: black;
    transition: 0.4s;
    border-radius: 50%;
    font-size: 0.8rem;
  }
`;

const StyledLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 37px;
  height: 22px;

  ${props =>
    props.large &&
    css`
      margin: 0 ${spacing.normal};
      height: 26px;
      width: 40px;
    `}

  & input {
    display: none;
  }

  & > input:checked + ${StyledSlider}::before {
    transform: translateX(20px);
    background-color: #507aa4;
    color: white;
    content: '${props => props.contentLabelOn}';
    border: 0.91px solid #446b92;
  }
`;

ToggleSwitch.propTypes = {
  on: PropTypes.bool,
  onClick: PropTypes.func,
  testId: PropTypes.string,
  large: PropTypes.bool,
  contentLabelOn: PropTypes.string,
  contentLabelOff: PropTypes.string,
};

ToggleSwitch.defaultProps = {
  contentLabelOff: 'T',
  contentLabelOn: 'K',
};

export default ToggleSwitch;
