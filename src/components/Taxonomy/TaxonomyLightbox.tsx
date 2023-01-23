/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { BookOpen } from '@ndla/icons/lib/common';
import { ModalV2, ModalCloseButton } from '@ndla/modal';
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
`;

const StyledTitle = styled.h2`
  font-weight: ${fonts.weight.semibold};
  margin: 0px;
  ${fonts.sizes(24)}
`;

interface Props {
  children: JSX.Element;
  onClose: () => void;
  loading?: boolean;
  title: string;
  onSelect?: () => void;
  wide?: boolean;
}

const TaxonomyLightbox = ({ children, title, onSelect, loading, onClose, wide = false }: Props) => {
  const { t } = useTranslation();

  return (
    <ModalV2
      onClose={onClose}
      controlled={true}
      isOpen={true}
      position="top"
      label={title}
      size={wide ? 'large' : 'normal'}>
      {onCloseModal => (
        <>
          <StyledHeader>
            <StyledTitleWrapper>
              <StyledIconWrapper>
                <StyledMenuBook />
              </StyledIconWrapper>
              <StyledTitle>{title}</StyledTitle>
            </StyledTitleWrapper>
            <ModalCloseButton onClick={onCloseModal} data-testid="taxonomyLightboxCloseButton" />
          </StyledHeader>
          <StyledContent>
            {children}
            {onSelect && (
              <StyledWrapper>
                <Button onClick={onSelect} data-testid="taxonomyLightboxButton">
                  {loading ? <Spinner appearance="small" /> : t('form.save')}
                </Button>
              </StyledWrapper>
            )}
          </StyledContent>
        </>
      )}
    </ModalV2>
  );
};

export default TaxonomyLightbox;
