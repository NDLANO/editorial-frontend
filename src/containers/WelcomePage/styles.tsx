/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import styled from '@emotion/styled';
import { spacing, colors, mq, breakpoints } from '@ndla/core';
import SafeLink from '@ndla/safelink';

export const StyledColumnHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  margin-top: ${spacing.medium};
  & > span {
    text-transform: uppercase;
    margin-left: ${spacing.small};
  }
`;

export const StyledDashboardInfo = styled.div`
  background-color: ${colors.brand.lighter};
  border-radius: 10px;
  padding: ${spacing.nsmall};
`;

export const StyledTopRowDashboardInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledLink = styled(SafeLink)`
  line-height: 1.5em;
  box-shadow: none;
  &:any-link {
    color: ${colors.brand.primary};
    text-decoration: underline;
    text-underline-offset: 0.25em;
    &:hover {
      text-decoration: none;
    }
  }
`;

export const DropdownWrapper = styled.div`
  max-width: 200px;
`;

export const ControlWrapperDashboard = styled.div`
  display: flex;
  gap: ${spacing.small};
  ${mq.range({ until: breakpoints.desktop })} {
    flex-direction: column;
  }
`;
