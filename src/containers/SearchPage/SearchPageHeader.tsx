/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { ListCheck, SearchContent, SearchMedia, VoiceprintLine } from "@ndla/icons";
import { PageContent } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { SearchType } from "../../interfaces";
import { toSearch } from "../../util/routeHelpers";

const StyledList = styled("ul", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    listStyle: "none",
    gap: "xsmall",
  },
});

const ItemWrapper = styled("li", {
  base: {
    placeSelf: "center",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    alignItems: "center",
    "& svg": {
      width: "xxlarge",
      height: "xxlarge",
      color: "stroke.default",
    },
    tabletWide: {
      width: "surface.3xsmall",
    },
    "& a": {
      width: "100%",
    },
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    paddingBlock: "medium",
  },
});

interface SearchObject {
  type: SearchType;
  title: string;
  url: string;
  icon: ReactNode;
}

const searchTypes: SearchObject[] = [
  {
    type: "content",
    title: "subNavigation.searchContent",
    url: toSearch({ page: "1", sort: "-lastUpdated", "page-size": 10 }, "content"),
    icon: <SearchContent />,
  },
  {
    type: "audio",
    title: "subNavigation.searchAudio",
    url: toSearch({ page: "1", sort: "-relevance", "page-size": 10 }, "audio"),
    icon: <VoiceprintLine />,
  },
  {
    type: "image",
    title: "subNavigation.searchImage",
    url: toSearch({ page: "1", sort: "-relevance", "page-size": 10 }, "image"),
    icon: <SearchMedia />,
  },
  {
    type: "podcast-series",
    title: "subNavigation.searchPodcastSeries",
    url: toSearch({ page: "1", sort: "-relevance", "page-size": 10 }, "podcast-series"),
    icon: <ListCheck />,
  },
];

export const SearchPageHeader = () => {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <>
      <StyledPageContent variant="page" asChild consumeCss aria-label={t("searchForm.searchTypes")}>
        <nav>
          <StyledList>
            {searchTypes.map((type) => {
              const currentPage = type.url.startsWith(location.pathname);
              return (
                <ItemWrapper key={type.type}>
                  {type.icon}
                  <SafeLinkButton
                    to={type.url}
                    variant={currentPage ? "primary" : "secondary"}
                    aria-current={currentPage}
                    css={linkOverlay.raw()}
                  >
                    {t(type.title)}
                  </SafeLinkButton>
                </ItemWrapper>
              );
            })}
          </StyledList>
        </nav>
      </StyledPageContent>
      <Outlet />
    </>
  );
};
