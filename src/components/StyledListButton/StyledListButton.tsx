/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing, fonts } from '@ndla/core';

const StyledListButton = styled.button`
  display: flex;
  width: 100%;
  padding: ${spacing.small};
  background: transparent;
  box-shadow: none;
  border: 0;
  color: ${colors.brand.primary};
  font-family: ${fonts.sans};
  font-weight: ${fonts.weight.semibold};
  white-space: nowrap;
  ${fonts.sizes(18, 1.1)};
  &:focus,
  &:hover {
    background: ${colors.brand.lighter} !important;
  }
`;

export default StyledListButton;
