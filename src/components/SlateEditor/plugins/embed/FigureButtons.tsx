/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';

export const StyledDeleteEmbedButton = styled(IconButtonV2)`
  &:hover,
  &:focus,
  &:focus-within,
  &:focus-visible,
  &:active {
    background-color: ${colors.white};
    svg {
      color: ${colors.support.red};
    }
  }
`;

export const StyledFigureButtons = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  position: absolute;
  right: ${spacing.nsmall};
  top: ${spacing.nsmall};
  z-index: 1;
  gap: ${spacing.xsmall};
`;
