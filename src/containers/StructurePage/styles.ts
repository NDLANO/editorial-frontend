/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { colors, fonts, spacing, breakpoints, misc, mq } from "@ndla/core";
import { Plus } from "@ndla/icons/action";
import { Share } from "@ndla/icons/common";

export const ResourceGroupBanner = styled.div`
  background-color: ${colors.brand.lighter};
  border-radius: 10px;
  ${fonts.sizes(16)};
  padding: ${spacing.small};
  margin-top: ${spacing.small};
  margin-bottom: ${spacing.small};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  align-content: center;
  min-height: 52px;
`;

export const StyledShareIcon = styled(Share)`
  width: 24px;
  height: 24px;
  margin-right: ${spacing.small};
`;

export const CardWrapper = styled.div`
  flex: 1;
  margin-bottom: ${spacing.xsmall};
`;

export const StyledResponsibleBadge = styled.div`
  height: ${spacing.normal};
  border-radius: 4px;
  color: ${colors.brand.dark};
  ${fonts.sizes(14)};
  flex: 6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const StyledResourceIcon = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  width: 42px;
  box-sizing: content-box;
  padding-right: ${spacing.small};

  @media (min-width: ${breakpoints.tablet}) {
    padding-right: ${spacing.small};
  }
`;

export const StyledResourceCard = styled.div`
  border: 1px solid ${colors.brand.light};
  border-radius: ${misc.borderRadius};
  width: 100%;
  padding: 5px;
  display: flex;
`;

export const BoldFont = styled.span`
  font-weight: ${fonts.weight.semibold};
`;

export const ResourceCardContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xxsmall};
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing.xsmall};
`;

export const StyledPlusIcon = styled(Plus)`
  ${mq.range({ until: breakpoints.tablet })} {
    display: none;
  }
`;
export const BannerWrapper = styled(ResourceGroupBanner)`
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

export const FlexContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

export const TopInfoRow = styled(FlexContentWrapper)`
  gap: ${spacing.small};
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
