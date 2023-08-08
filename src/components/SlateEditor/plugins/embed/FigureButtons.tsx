/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';

export const StyledFigureButtons = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  position: absolute;
  right: ${spacing.nsmall};
  top: ${spacing.nsmall};
  z-index: 2;
  gap: ${spacing.xsmall};

  &[data-white='true'] {
    > a,
    button {
      background: ${colors.white};

      &:hover {
        background: transparent;
        border-color: transparent;
      }
    }
  }
`;
