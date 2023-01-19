/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Button from '@ndla/button';
import { Cross } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import { BookOpen } from '@ndla/icons/lib/common';
import Overlay from '../Overlay';
import Spinner from '../Spinner';

const StyledCloseButton = styled(Button)`
  height: 50px;
  width: 50px;
`;

const StyledCross = styled(Cross)`
  height: 24px;
  width: 24px;
  margin-right: 7px;
`;

const StyledLightboxWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1;
  display: flex;
  justify-content: center;
`;

const StyledContentWrapper = styled.div<{ wide: boolean }>`
  background-color: ${colors.white};
  box-shadow: 0 0 2px 0 rgba(115, 115, 115, 0.5);
  width: ${props => (props.wide ? '900px' : '620px')};
  border-radius: 5px;
  position: absolute;
  top: 5%;
  z-index: 2;
  max-height: 90vh;
  overflow: auto;
`;

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
  color: ${colors.white};
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

const StyledTitle = styled.div`
  font-weight: ${fonts.weight.semibold};
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
    <StyledLightboxWrapper>
      <Overlay onExit={onClose} />
      <StyledContentWrapper wide={wide}>
        <StyledHeader>
          <StyledTitleWrapper>
            <StyledIconWrapper>
              <StyledMenuBook />
            </StyledIconWrapper>
            <StyledTitle>{title}</StyledTitle>
          </StyledTitleWrapper>
          <StyledCloseButton stripped onClick={onClose} data-testid="taxonomyLightboxCloseButton">
            <StyledCross />
          </StyledCloseButton>
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
      </StyledContentWrapper>
    </StyledLightboxWrapper>
  );
};

export default TaxonomyLightbox;
