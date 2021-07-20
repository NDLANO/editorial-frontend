/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

const StyledRow = styled('div')<Props>`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${p => (p.spacing ? spacing[p.spacing] : spacing.normal)};
  ${p => p.justifyContent && `justify-content: ${p.justifyContent}`};
  ${p => p.alignItems && `align-items: ${p.alignItems}`};
`;

export const Row = ({ spacing, alignItems, justifyContent, children }: Props) => (
  <StyledRow spacing={spacing} alignItems={alignItems} justifyContent={justifyContent}>
    {children}
  </StyledRow>
);

Row.defaultProps = {
  spacing: 'normal',
};

interface Props {
  children: React.ReactNode;
  spacing?: 'xsmall' | 'small' | 'normal' | 'medium' | 'large';
  alignItems?: 'normal' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  justifyContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'stretch'
    | 'baseline'
    | 'space-around'
    | 'space-between'
    | 'space-evenly';
}
