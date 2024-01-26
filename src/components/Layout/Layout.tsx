/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { spacing, mq } from "@ndla/core";

export const GRID_GAP = spacing.nsmall;

export const GridContainer = styled.div<{ breakpoint?: string }>`
  ${({ breakpoint }) => breakpoint && mq.range({ from: "0px", until: breakpoint })} {
    padding: 0 ${GRID_GAP};
    display: flex;
    flex-direction: column;
    gap: ${GRID_GAP};
  }

  ${({ breakpoint }) => mq.range({ from: breakpoint ?? "0px" })} {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: ${GRID_GAP};
    max-width: 1400px;
    justify-self: center;
    align-self: center;
    width: 100%;
    padding: 0 ${spacing.nsmall};
  }
`;
interface ColumnSize {
  colStart?: number;
  colEnd?: number;
}

export const Column = styled.div<ColumnSize>`
  grid-column: ${(props) => `${props.colStart ?? 1} / ${props.colEnd ?? 13}`};
  min-width: 400px;
`;
