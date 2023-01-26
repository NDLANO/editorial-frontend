/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import { Share } from '@ndla/icons/lib/common';

export const spacingTop = spacing.small;

export const ResourceGroupBanner = styled.div`
  background-color: ${colors.brand.lighter};
  border-radius: 10px;
  ${fonts.sizes(16)};
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  padding: 10px;
  margin-top: ${spacingTop};
  margin-bottom: ${spacing.small};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  align-content: center;
  min-height: 52px;
`;

export const StyledIcon = styled(Share)`
  width: 24px;
  height: 24px;
  margin-right: ${spacing.small};
`;
