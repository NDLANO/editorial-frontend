/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { colors, fonts } from '@ndla/core';

interface Props {
  error?: boolean;
  float?: 'left' | 'right' | 'none' | 'inherit';
  children: ReactNode;
}

export const StyledHelpMessage = styled.span`
  display: block;
  font-size: ${fonts.sizes(14, 1.2)};
  color: ${(p: Props) => (p.error ? colors.support.red : 'black')};
  float: ${(p: Props) => p.float || 'none'};
`;

const FormFieldHelp = ({ error, float, children }: Props) => (
  <StyledHelpMessage error={error} float={float}>
    {children}
  </StyledHelpMessage>
);

FormFieldHelp.propTypes = {
  error: PropTypes.bool,
  float: PropTypes.oneOf(['left', 'right', 'none', 'inherit']),
};

export default FormFieldHelp;
