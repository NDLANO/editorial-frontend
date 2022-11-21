/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { Calendar } from '@ndla/icons/editor';

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
  font-size: ${fonts.sizes('16px', '20px')};
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

interface Props {
  title: string;
  description: string;
}

const TableComponent = ({ title, description }: Props) => {
  return (
    <TableComponentWrapper>
      <StyledIconWrapper>
        <Calendar className="c-icon--medium" style={{ color: `${colors.white}` }} />
      </StyledIconWrapper>
      <TextWrapper>
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
      </TextWrapper>
    </TableComponentWrapper>
  );
};

export default TableComponent;
