/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { spacing, breakpoints, mq } from '@ndla/core';

export const GridContainer = styled.div`
  ${mq.range({ from: '0px', until: breakpoints.tabletWide })} {
    padding: ${spacing.nsmall};
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 1em;
    max-width: 1400px;
    justify-self: center;
    align-self: center;
    width: 100%;
  }
`;

export const GridHeader = styled.div`
  grid-column: 2 / 12;
`;

export const LeftColumn = styled.div`
  grid-column: 3 / 7;
`;
export const RightColumn = styled.div`
  grid-column: 7 / 11;
`;
