/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { BookOpen } from '@ndla/icons/common';
import { ModalCloseButton, ModalPosition, ModalTitle } from '@ndla/modal';
import Spinner from '../Spinner';

const StyledHeader = styled.div`
  background: ${colors.brand.lighter};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  ${fonts.sizes(24, 1.1)};
  padding: ${spacing.nsmall};
  height: 90px;
  color: ${colors.text.primary};
`;

const StyledContent = styled.div`
  padding: ${spacing.normal} ${spacing.large};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

const StyledIconWrapper = styled.div`
  width: ${spacing.large};
  height: ${spacing.large};
  border-radius: 50%;
  background-color: ${colors.brand.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.white};
  margin-right: ${spacing.nsmall};
`;

const StyledTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledMenuBook = styled(BookOpen)`
  width: ${spacing.normal};
  height: ${spacing.normal};
`;

const StyledWrapper = styled.div`
  padding: ${spacing.small} 0px;
  display: flex;
  gap: ${spacing.xsmall};
`;

const StyledTitle = styled(ModalTitle)`
  font-weight: ${fonts.weight.semibold};
  margin: 0px;
  ${fonts.sizes(24)}
`;

interface Props {
  children: JSX.Element;
  title: string;
  actions?: {
    text: string;
    onClick: () => void;
    'data-testid'?: string;
    loading?: boolean;
  }[];
  position?: ModalPosition;
}

const TaxonomyLightbox = ({ children, title, actions = [], position = 'top' }: Props) => {
  return (
    <>
      <StyledHeader>
        <StyledTitleWrapper>
          <StyledIconWrapper>
            <StyledMenuBook />
          </StyledIconWrapper>
          <StyledTitle as="h2">{title}</StyledTitle>
        </StyledTitleWrapper>
        <ModalCloseButton data-testid="taxonomyLightboxCloseButton" />
      </StyledHeader>
      <StyledContent>
        {children}
        <StyledWrapper>
          {actions.map((a, i) => (
            <ButtonV2 key={i} onClick={a.onClick} data-testid={a['data-testid']}>
              {a.loading ? <Spinner appearance="small" /> : a.text}
            </ButtonV2>
          ))}
        </StyledWrapper>
      </StyledContent>
    </>
  );
};

export default TaxonomyLightbox;
