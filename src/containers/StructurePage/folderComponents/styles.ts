/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { spacing, colors } from '@ndla/core';

export const filterWrapper = css`
  background-color: white;
  padding: calc(${spacing.small} / 2);
  position: relative;
`;

export const StyledErrorMessage = styled('div')`
  color: ${colors.support.red};
  text-align: center;
`;

export const StyledMenuItemInputField = styled('input')`
  margin-right: calc(${spacing.small} / 2);
  max-height: ${spacing.normal};
  width: 100%;
`;

export const StyledMenuItemEditField = styled('div')`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;
