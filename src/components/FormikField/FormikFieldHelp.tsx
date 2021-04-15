/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { colors, fonts } from '@ndla/core';

interface Props {
  error?: boolean;
  float?: 'left' | 'right' | 'none' | 'inherit';
  children: React.ReactNode;
}

const StyledHelpMessage = styled.span`
  display: block;
  font-size: ${fonts.sizes(14, 1.2)};
  color: ${(p: Props) => (p.error ? colors.support.red : 'black')};
  float: ${(p: Props) => p.float || 'none'};
`;

const FormikFieldHelp = ({ error, float, children }: Props) => (
  <StyledHelpMessage error={error} float={float}>
    {children}
  </StyledHelpMessage>
);

FormikFieldHelp.propTypes = {
  error: PropTypes.bool,
  float: PropTypes.oneOf(['left', 'right', 'none', 'inherit']),
};

export default FormikFieldHelp;
