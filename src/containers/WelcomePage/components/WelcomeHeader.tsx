/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { breakpoints, colors, fonts, mq, spacing, stackOrder } from "@ndla/core";
import { SafeLinkButton } from "@ndla/safelink";
import { useSession } from "../../Session/SessionProvider";

const StyledHeader = styled.div`
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  background-color: ${colors.brand.lighter};
  justify-content: space-evenly;
  padding: ${spacing.xsmall};
  border-radius: 10px;

  ${mq.range({ until: breakpoints.mobileWide, from: "0px" })} {
    flex-direction: column;
    justify-content: center;
    gap: ${spacing.xsmall};
  }

  position: relative;
`;

const ButtonWrapper = styled.div`
  z-index: ${stackOrder.offsetSingle};
`;

const StyledTitle = styled.h1`
  ${fonts.sizes(24, 1.2)};
  color: ${colors.brand.primary};
  margin: 0;
  font-family: ${fonts.sans};
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
  width: 130px;
  height: 50px;
  border-radius: 10px 0 100px 0;
`;

const RightShape = styled.div`
  ${shapeStyles}
  right: 0;
  bottom: 0;
  width: 110px;
  height: 50px;
  border-radius: 100px 0 10px 0;
`;

const ContentWrapper = styled.div`
  z-index: ${stackOrder.offsetSingle};
  text-align: center;
`;

export const WelcomeHeader = () => {
  const { userName } = useSession();
  const { t } = useTranslation();

  return (
    <StyledHeader>
      <LeftShape />
      <ContentWrapper>
        <StyledTitle>
          {`${t("welcomePage.welcomeBack")} ${userName ? `${userName}!` : t("welcomePage.welcomeText")}`}
        </StyledTitle>
      </ContentWrapper>
      <ButtonWrapper>
        <StyledSafeLinkButton to="/structure">{t("subNavigation.structure")}</StyledSafeLinkButton>
      </ButtonWrapper>
      <RightShape />
    </StyledHeader>
  );
};

export default WelcomeHeader;
