import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import SafeLink from '@ndla/safelink';

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
  &:any-link {
    color: ${colors.brand.primary};
  }
`;

export const DropdownWrapper = styled.div`
  width: 200px;
`;

export const ControlWrapperDashboard = styled.div`
  display: flex;
  gap: ${spacing.small};
`;
