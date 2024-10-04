/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { spacing, mq, breakpoints } from "@ndla/core";
import { SwitchLabel, SwitchRoot } from "@ndla/primitives";

export const StyledTopRowDashboardInfo = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: ${spacing.small};
  ${mq.range({ until: breakpoints.tabletWide })} {
    flex-direction: column;
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

export const StyledSwitchLabel = styled(SwitchLabel)`
  white-space: nowrap;
`;

export const StyledSwitchRoot = styled(SwitchRoot)`
  margin-inline-start: auto;
`;

export const TopRowControls = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${spacing.xsmall};
  ${mq.range({ until: breakpoints.tabletWide })} {
    justify-content: flex-start;
  }
`;
