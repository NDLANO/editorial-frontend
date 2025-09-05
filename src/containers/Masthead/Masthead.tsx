/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { NdlaLogoText, PageContent, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { MastheadDrawer } from "./components/MastheadDrawer";
import { MastheadLinks } from "./components/MastheadLinks";
import { MastheadSearch } from "./components/MastheadSearch";
import { MastheadSessionLink } from "./components/MastheadSessionLink";
import config from "../../config";
import { routes } from "../../util/routeHelpers";

const MastheadContainer = styled("div", {
  base: {
    zIndex: "banner",
    boxShadow: "inner",
    paddingInline: "xsmall",
    paddingBlock: "xsmall",
    display: "flex",
    gap: "xsmall",
    alignItems: "center",
  },
  defaultVariants: { environment: "test" },
  variants: {
    environment: {
      prod: {
        background: "background.default",
      },
      staging: {
        background: "surface.brand.3.subtle",
      },
      test: {
        background: "surface.brand.2.subtle",
      },
    },
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
    alignItems: "center",
    width: "100%",
    justifySelf: "center",
  },
});

const StyledMastheadLinks = styled(MastheadLinks, {
  base: {
    desktopDown: {
      display: "none",
    },
  },
});

const StyledMastheadSessionLink = styled(MastheadSessionLink, {
  base: {
    desktopDown: {
      display: "none",
    },
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    width: "100%",
  },
});

const StyledText = styled(Text, {
  base: {
    mobileWideDown: {
      display: "none",
    },
  },
});

type Environment = "prod" | "staging" | "test";

export const Masthead = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const environmentName = useMemo(() => {
    switch (config.ndlaEnvironment) {
      case "prod":
        return t("environment.production");
      case "staging":
        return t("environment.staging");
      default:
        return t("environment.test");
    }
  }, [t]);

  return (
    <MastheadContainer environment={config.ndlaEnvironment as Environment} id="masthead">
      <StyledText textStyle="label.large" fontWeight="bold" color="text.strong">
        {environmentName}
      </StyledText>
      <StyledPageContent variant="wide" gutters="never">
        <ContentWrapper>
          <MastheadDrawer />
          <SafeLink
            to={routes.home}
            aria-label={t("logo.altText")}
            title={t("logo.altText")}
            reloadDocument={location.pathname === routes.home}
          >
            <NdlaLogoText />
          </SafeLink>
          <MastheadSearch />
          <StyledMastheadLinks />
          <StyledMastheadSessionLink />
        </ContentWrapper>
      </StyledPageContent>
    </MastheadContainer>
  );
};
