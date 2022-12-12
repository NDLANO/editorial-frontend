/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { colors, spacing, fonts, mq, breakpoints } from '@ndla/core';
import styled from '@emotion/styled';
import { SafeLinkButton } from '@ndla/safelink';
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { useSession } from '../../Session/SessionProvider';

const StyledWrapper = styled.header`
  height: 150px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
`;

const StyledHeader = styled.div`
  width: 100%;
  height: 130px;
  display: flex;
  align-items: center;
  background-color: ${colors.brand.lighter};
  justify-content: space-evenly;
  padding: ${spacing.small};
  border-radius: 10px;
  position: relative;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  z-index: 1;
`;

const StyledTitle = styled.h1`
  ${fonts.sizes(24, 1.2)};
  color: ${colors.brand.primary};
  margin: 0;
  font-family: ${fonts.sans};
  white-space: nowrap;
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  font-weight: ${fonts.weight.normal};
  ${fonts.sizes(16, 1.1)};
`;

const shapeStyles = css`
  position: absolute;
  background-color: ${colors.brand.light};
`;

const LeftShape = styled.div`
  ${shapeStyles}
  left: 0;
  top: 0;
  width: 120px;
  height: 100px;
  border-radius: 10px 0 100px 0;
`;

const RightShape = styled.div`
  ${shapeStyles}
  right: 0;
  bottom: 0;
  width: 110px;
  height: 80px;
  border-radius: 100px 0 10px 0;
`;

const StyledImg = styled.img`
  display: none;
  ${mq.range({ from: breakpoints.tablet })} {
    display: inline;
  }
`;

const ContentWrapper = styled.div`
  z-index: 1;
`;

export const WelcomeHeader = () => {
  const { userName } = useSession();
  const { t } = useTranslation();

  return (
    <StyledWrapper>
      <StyledHeader>
        <LeftShape />
        <ContentWrapper>
          <StyledImg src="/welcome-page-person.svg" alt="" />
        </ContentWrapper>
        <ContentWrapper>
          <StyledTitle>
            <span>{t('welcomePage.welcomeBack')}</span>
            <span
              css={{
                marginLeft: `${spacing.large}`,
                display: 'block',
              }}>
              {userName ? `${userName}!` : null}
            </span>
          </StyledTitle>
        </ContentWrapper>
        <ButtonWrapper>
          <StyledSafeLinkButton to="/structure">
            {t('subNavigation.structure')}
          </StyledSafeLinkButton>
          <StyledSafeLinkButton to="subject-matter/learning-resource/new">
            {t('subNavigation.subjectMatter')}
          </StyledSafeLinkButton>
        </ButtonWrapper>
        <RightShape />
      </StyledHeader>
    </StyledWrapper>
  );
};

export default WelcomeHeader;
