/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import styled from "@emotion/styled";
import { spacing, colors, mq, breakpoints, fonts } from "@ndla/core";
import { SafeLink } from "@ndla/safelink";
import { Switch } from "@ndla/switch";

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
  margin-bottom: ${spacing.small};
  ${mq.range({ until: breakpoints.tabletWide })} {
    flex-direction: column;
  }
`;

export const StyledLink = styled(SafeLink)`
  line-height: 1.5em;
  box-shadow: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  min-width: 130px;
  ${mq.range({ until: breakpoints.tablet })} {
    min-width: unset;
  }
`;

export const ControlWrapperDashboard = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  flex-direction: column;
  ${mq.range({ until: breakpoints.tabletWide })} {
    flex-direction: row;
  }
`;
export const SwitchWrapper = styled.div`
  margin-top: ${spacing.xxsmall};
  margin-left: auto;
`;

export const StyledSwitch = styled(Switch)`
  white-space: nowrap;
  ${mq.range({ until: breakpoints.tabletWide })} {
    margin-right: auto;
  }
  label {
    font-size: ${fonts.sizes("16px")};
    ${mq.range({ from: breakpoints.tabletWide })} {
      margin-left: auto;
    }
  }
`;

export const TopRowControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.xsmall};
  ${mq.range({ until: breakpoints.tabletWide })} {
    justify-content: flex-start;
  }
`;
