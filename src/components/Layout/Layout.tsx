/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing, breakpoints, mq } from '@ndla/core';

export const GridContainer = styled.div<{ breakpoint?: string }>`
  ${({ breakpoint }) => mq.range({ from: '0px', until: breakpoint ?? breakpoints.tabletWide })} {
    padding: ${spacing.nsmall};
  }

  ${({ breakpoint }) => mq.range({ from: breakpoint ?? breakpoints.tabletWide })} {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 1em;
    max-width: 1400px;
    justify-self: center;
    align-self: center;
    width: 100%;
    padding: 0 ${spacing.nsmall};
  }
`;

export const MainArea = styled.div`
  grid-column: 2 / 12;
`;

interface ColumnSize {
  colStart?: number;
  colEnd?: number;
}

export const LeftColumn = styled.div<ColumnSize>`
  grid-column: ${props => `${props.colStart ?? 3} / ${props.colEnd ?? 7}`};
`;
export const RightColumn = styled.div<ColumnSize>`
  grid-column: ${props => `${props.colStart ?? 7} / ${props.colEnd ?? 11}`};
`;
