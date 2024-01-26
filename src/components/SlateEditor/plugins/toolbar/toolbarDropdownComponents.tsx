/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { DropdownContent } from '@ndla/dropdown-menu';
import ToolbarButton from './ToolbarButton';

export const ToolbarDropdownContent = styled(DropdownContent)`
  padding: ${spacing.xsmall};
  flex: 1;
  align-items: flex-start;
  border: 1px solid ${colors.brand.tertiary};
`;

export const ToolbarDropdownButton = styled(ToolbarButton)`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: flex-start;
`;
