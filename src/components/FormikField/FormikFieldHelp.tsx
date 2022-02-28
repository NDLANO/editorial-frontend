/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { colors, fonts } from '@ndla/core';

interface Props {
  error?: boolean;
  warning?: boolean;
  float?: 'left' | 'right' | 'none' | 'inherit';
  children: ReactNode;
}

export const StyledHelpMessage = styled.span<Props>`
  display: block;
  font-size: ${fonts.sizes(14, 1.2)};
  color: ${p => (p.error ? colors.support.red : 'black')};
  float: ${p => p.float || 'none'};
`;

const StyledWarningMessage = styled.span<Props>`
  display: block;
  font-size: ${fonts.sizes(14, 1.2)};
  color: ${p => (p.warning ? '#8c8c00' : 'black')};
  float: ${p => p.float || 'none'};
`;

const FormikFieldHelp = ({ error, warning, float, children }: Props) =>
  warning ? (
    <StyledWarningMessage warning={warning} float={float}>
      {children}
    </StyledWarningMessage>
  ) : (
    <StyledHelpMessage error={error} float={float}>
      {children}
    </StyledHelpMessage>
  );

export default FormikFieldHelp;
