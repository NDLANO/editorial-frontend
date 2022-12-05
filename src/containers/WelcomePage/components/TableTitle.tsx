/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { ElementType } from 'react';

const TableComponentWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing.normal};
`;

const StyledTitle = styled.span`
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  ${fonts.sizes('22px', '27px')};
`;

const StyledDescription = styled.div`
  font-weight: normal;
  ${fonts.sizes('16px', '20px')};
  color: ${colors.text.light};
`;

const StyledIconWrapper = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${colors.brand.primary};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${spacing.normal};
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
}

const TableComponent = ({ title, description, Icon }: Props) => {
  return (
    <TableComponentWrapper>
      <StyledIconWrapper>
        <Icon css={iconStyles} />
      </StyledIconWrapper>
      <TextWrapper>
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
      </TextWrapper>
    </TableComponentWrapper>
  );
};

export default TableComponent;
