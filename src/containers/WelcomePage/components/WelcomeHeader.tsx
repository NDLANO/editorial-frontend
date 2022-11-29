/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { colors, spacing, fonts } from '@ndla/core';
import styled from '@emotion/styled';
import { SafeLinkButton } from '@ndla/safelink';
import { useSession } from '../../Session/SessionProvider';

const StyledWrapper = styled.header`
  height: 150px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  min-width: 600px;
`;

const zIndex = {
  header: 0,
  shapes: 1,
  content: 2,
};

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
  z-index: ${zIndex.header};
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  z-index: ${zIndex.content};
`;

const StyledTitle = styled.h1`
  font-size: ${fonts.sizes(24, 1.2)};
  color: ${colors.brand.primary};
  margin: 0;
  font-family: ${fonts.sans};
  white-space: nowrap;
`;

const ButtonText = styled.div`
  font-weight: ${fonts.weight.normal};
  font-size: ${fonts.sizes(16, 1.1)};
`;

const LeftShape = styled.div`
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  background-color: ${colors.brand.light};
  width: 120px;
  height: 100px;
  border-radius: 10px 0 100px 0;
  z-index: ${zIndex.shapes};
`;

const RightShape = styled.div`
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: ${colors.brand.light};
  width: 110px;
  height: 80px;
  border-radius: 100px 0 10px 0;
  z-index: ${zIndex.shapes};
`;

const StyledImage = styled.img`
  height: 150;
  width: 170;
`;

const ContentWrapper = styled.div`
  z-index: ${zIndex.content};
`;

export const WelcomeHeader = () => {
  const { userName } = useSession();

  return (
    <StyledWrapper>
      <StyledHeader>
        <LeftShape />
        <ContentWrapper>
          <StyledImage
            src="/welcome-page-person.svg"
            alt="illustration-person"
            aria-hidden={true}
          />
        </ContentWrapper>
        <ContentWrapper>
          <StyledTitle>Velkommen tilbake</StyledTitle>
          <StyledTitle
            css={{
              marginLeft: `${spacing.large}`,
            }}>{`${userName}!`}</StyledTitle>
        </ContentWrapper>
        <ButtonWrapper>
          <SafeLinkButton to="/structure">
            <ButtonText>Strukturredigering</ButtonText>
          </SafeLinkButton>
          <SafeLinkButton to="subject-matter/learning-resource/new">
            <ButtonText> Opprett tom artikkel</ButtonText>
          </SafeLinkButton>
        </ButtonWrapper>
        <RightShape />
      </StyledHeader>
    </StyledWrapper>
  );
};

export default WelcomeHeader;
