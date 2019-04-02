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

const StyledHelpMessage = styled.span`
  display: block;
  font-size: ${fonts.sizes(14, 1.2)};
  color: ${p => (p.error ? colors.support.red : 'black')};
  float: ${p => p.float || 'none'};
`;

const FormikFieldHelp = ({ error, float, children }) => (
  <StyledHelpMessage error={error} float={float}>
    {children}
  </StyledHelpMessage>
);

FormikFieldHelp.propTypes = {
  error: PropTypes.bool,
  float: PropTypes.string,
};

export default FormikFieldHelp;
