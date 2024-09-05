/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { IconButtonV2 } from "@ndla/button";
import { colors, fonts, spacing, stackOrder } from "@ndla/core";
import { Menu } from "@ndla/icons/common";
import { NdlaLogoText } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import NavigationMenu from "./NavigationMenu";
import SessionContainer from "./SessionContainer";
import { Column, GridContainer } from "../../../components/Layout/Layout";
import Overlay from "../../../components/Overlay";
import config from "../../../config";
import SavedSearchDropdown from "../SavedSearchDropdown";

const StyledLogoDiv = styled.div`
  transform: translateY(3px);
`;

interface StyledNavigationWrapperProps {
  backgroundColor?: string;
}

const StyledNavigationWrapper = styled.div<StyledNavigationWrapperProps>`
  position: relative;
  z-index: ${stackOrder.banner};
  background: ${(props) => props.backgroundColor};
`;

const StyledHeaderItems = styled.div`
  display: flex;
  gap: ${spacing.medium};
  padding: ${spacing.small} 0;
  border-bottom: 1px solid ${colors.brand.neutral7};
  > div {
    display: flex;
    align-items: center;
  }
`;

const StyledEnvironmentText = styled.p`
  font-weight: ${fonts.weight.semibold};
  color: ${colors.brand.primary};
  margin: 0px;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

const LeftContent = styled.div`
  display: flex;
  gap: ${spacing.normal};
  flex: 1;
`;

const EnvText = styled(FlexWrapper)`
  align-items: center;
  justify-content: flex-start;
  padding-left: ${spacing.small};
`;

const HiddenEnvText = styled(EnvText)`
  visibility: hidden;
`;

const LinkWrapper = styled.div`
  gap: ${spacing.small};
`;

const StyledPopoverContent = styled(PopoverContent)`
  z-index: ${stackOrder.popover};
  background-color: ${colors.brand.primary};
  width: 100vw;
`;

interface EnvironmentSettings {
  color: string;
  name: string;
}

const Navigation = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState<boolean>(false);

  const envSettings = useMemo((): EnvironmentSettings => {
    switch (config.ndlaEnvironment) {
      case "prod":
        return { color: colors.white, name: t("environment.production") };
      case "staging":
        return { color: colors.brand.lighter, name: t("environment.staging") };
      default:
        return {
          color: colors.assessmentResource.background,
          name: t("environment.test"),
        };
    }
  }, [t]);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <StyledNavigationWrapper backgroundColor={envSettings?.color}>
          <FlexWrapper>
            <EnvText>
              <StyledEnvironmentText>{envSettings.name}</StyledEnvironmentText>
            </EnvText>
            <GridContainer>
              <Column>
                <StyledHeaderItems>
                  <LeftContent>
                    <PopoverTrigger asChild>
                      <IconButtonV2 aria-label={t("menu.title")} colorTheme="light">
                        <Menu />
                      </IconButtonV2>
                    </PopoverTrigger>
                    <StyledLogoDiv>
                      <SafeLink
                        to="/"
                        aria-label={t("logo.altText")}
                        title={t("logo.altText")}
                        reloadDocument={pathname === "/"}
                      >
                        <NdlaLogoText />
                      </SafeLink>
                    </StyledLogoDiv>
                    <SavedSearchDropdown />
                  </LeftContent>
                  <LinkWrapper>
                    <SafeLink target="_blank" to="https://edndla.zendesk.com/hc/no">
                      Zendesk
                    </SafeLink>
                    <SafeLink target="_blank" to="https://kvalitet.ndla.no/">
                      Kvalitaisen
                    </SafeLink>
                  </LinkWrapper>
                  <SessionContainer />
                </StyledHeaderItems>
              </Column>
            </GridContainer>
            <HiddenEnvText aria-hidden>
              <StyledEnvironmentText>{envSettings.name}</StyledEnvironmentText>
            </HiddenEnvText>
          </FlexWrapper>
        </StyledNavigationWrapper>
      </PopoverAnchor>

      <StyledPopoverContent>
        <NavigationMenu close={closeMenu} />
      </StyledPopoverContent>
      {open && <Overlay modifiers={"lighter"} />}
    </Popover>
  );
};

export default Navigation;
