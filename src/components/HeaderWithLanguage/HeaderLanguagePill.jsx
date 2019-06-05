/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, fonts, spacing } from '@ndla/core';

const currentStyle = css`
  color: #${colors.brand.primary};
  background: transparent;
  &:focus,
  &:hover {
    color: #fff;
    background: ${colors.brand.primary};
    transform: translate(1px, 1px);
  }
`;
const StyledLanguagePill = styled.span`
  background: ${colors.brand.light};
  color: ${colors.brand.primary};
  box-shadow: none;
  border-radius: ${spacing.xsmall};
  padding: ${spacing.xsmall} ${spacing.small};
  ${fonts.sizes(16, 1.1)};
  font-weight: ${fonts.weight.semibold};
  margin-right: ${spacing.xsmall};
  transition: all 200ms ease;
  display: flex;
  align-items: center;

  .c-icon {
    margin-right: ${spacing.xsmall};
  }

  ${props => !props.current && currentStyle}
`;

const LanguagePill = ({ children, withComponent, ...rest }) => {
  const StyledLanguagePillWithComponent = withComponent
    ? StyledLanguagePill.withComponent(withComponent)
    : StyledLanguagePill;
  return (
    <StyledLanguagePillWithComponent {...rest}>
      {children}
    </StyledLanguagePillWithComponent>
  );
};

LanguagePill.propTypes = {
  withComponent: PropTypes.func,
};

export default LanguagePill;
