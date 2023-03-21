/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { spacing as styledSpacing } from '@ndla/core';
import { AlignItemsType, JustifyContentType } from '../style/styleInterfaces';

const StyledRow = styled('div')<Props>`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${p => (p.spacing ? styledSpacing[p.spacing] : styledSpacing.normal)};
  ${p => p.justifyContent && `justify-content: ${p.justifyContent}`};
  ${p => p.alignItems && `align-items: ${p.alignItems}`};
`;

interface Props {
  children: ReactNode;
  spacing?: keyof typeof styledSpacing;
  alignItems?: AlignItemsType;
  justifyContent?: JustifyContentType;
}

export const Row = ({ spacing = 'normal', alignItems, justifyContent, children }: Props) => (
  <StyledRow spacing={spacing} alignItems={alignItems} justifyContent={justifyContent}>
    {children}
  </StyledRow>
);
