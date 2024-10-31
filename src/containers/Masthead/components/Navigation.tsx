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
import { Menu } from "@ndla/icons/common";
import {
  IconButton,
  NdlaLogoText,
  PopoverAnchor,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HStack, styled } from "@ndla/styled-system/jsx";
import NavigationMenu from "./NavigationMenu";
import SessionContainer from "./SessionContainer";
import { Column, GridContainer } from "../../../components/Layout/Layout";
import Overlay from "../../../components/Overlay";
import config from "../../../config";
import SavedSearchDropdown from "../SavedSearchDropdown";

const StyledNavigationWrapper = styled("div", {
  base: {
    zIndex: "banner",
    width: "100%",
  },
  variants: {
    backgroundColor: {
      white: {
        backgroundColor: "background.subtle",
      },
      purple: {
        backgroundColor: "surface.brand.1.moderate",
      },
      red: {
        backgroundColor: "surface.dangerSubtle",
      },
    },
  },
});

const StyledHeaderItems = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
    paddingBlock: "xsmall",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
  },
});

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    width: "100vw",
  },
});
interface EnvironmentSettings {
  color: "red" | "purple" | "white";
  name: string;
}

const Navigation = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState<boolean>(false);

  const envSettings = useMemo((): EnvironmentSettings => {
    switch (config.ndlaEnvironment) {
      case "prod":
        return { color: "white", name: t("environment.production") };
      case "staging":
        return { color: "purple", name: t("environment.staging") };
      default:
        return {
          color: "red",
          name: t("environment.test"),
        };
    }
  }, [t]);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <PopoverRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <PopoverAnchor asChild>
        <StyledNavigationWrapper backgroundColor={envSettings?.color}>
          <HStack justify="center">
            <Text fontWeight="bold">{envSettings.name}</Text>
            <GridContainer>
              <Column>
                <StyledHeaderItems>
                  <HStack gap="medium">
                    <PopoverTrigger asChild>
                      <IconButton aria-label={t("menu.title")} variant="clear">
                        <Menu />
                      </IconButton>
                    </PopoverTrigger>
                    <SafeLink
                      to="/"
                      aria-label={t("logo.altText")}
                      title={t("logo.altText")}
                      reloadDocument={pathname === "/"}
                    >
                      <NdlaLogoText />
                    </SafeLink>
                    <SavedSearchDropdown />
                  </HStack>
                  <HStack gap="xsmall">
                    <SafeLink target="_blank" to="https://edndla.zendesk.com/hc/no">
                      Zendesk
                    </SafeLink>
                    <SafeLink target="_blank" to="https://kvalitet.ndla.no/">
                      Kvalitaisen
                    </SafeLink>
                  </HStack>
                  <SessionContainer />
                </StyledHeaderItems>
              </Column>
            </GridContainer>
            <div hidden={true} aria-hidden>
              <Text fontWeight="bold">{envSettings.name}</Text>
            </div>
          </HStack>
        </StyledNavigationWrapper>
      </PopoverAnchor>
      <StyledPopoverContent>
        <NavigationMenu close={closeMenu} />
      </StyledPopoverContent>
      {open && <Overlay modifiers={"lighter"} />}
    </PopoverRoot>
  );
};

export default Navigation;
