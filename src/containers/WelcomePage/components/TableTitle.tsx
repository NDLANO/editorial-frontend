/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { spacing, colors, fonts } from "@ndla/core";
import { InformationOutline } from "@ndla/icons/common";

const ComponentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.xsmall};
`;
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing.small};
`;

const StyledTitle = styled.span`
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  ${fonts.sizes("22px", "27px")};
`;

const StyledDescription = styled.div`
  font-weight: normal;
  ${fonts.sizes("12px")};
  color: ${colors.text.light};
`;

const StyledIconWrapper = styled.div`
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  background-color: ${colors.brand.primary};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${spacing.small};
`;

const iconStyles = css`
  color: ${colors.white};
  width: 24px;
  height: 24px;
`;

interface Props {
  title: string;
  description: string;
  Icon: ElementType;
  infoText?: string;
}

const TableComponent = ({ title, description, Icon, infoText }: Props) => {
  return (
    <ComponentWrapper>
      <StyledIconWrapper>
        <Icon css={iconStyles} />
      </StyledIconWrapper>
      <TextWrapper>
        <ComponentWrapper>
          <StyledTitle>{title}</StyledTitle>
          {infoText && (
            <div>
              <InformationOutline aria-label={infoText} title={infoText} />
            </div>
          )}
        </ComponentWrapper>
        <StyledDescription>{description}</StyledDescription>
      </TextWrapper>
    </ComponentWrapper>
  );
};

export default TableComponent;
