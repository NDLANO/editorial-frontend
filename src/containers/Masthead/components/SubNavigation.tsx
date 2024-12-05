/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { UseQueryResult } from "@tanstack/react-query";
import { PageContent } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { SearchType } from "../../../interfaces";
import { SearchParamsBody } from "../../SearchPage/components/form/SearchForm";
import { ResultType } from "../../SearchPage/SearchContainer";

interface SubType {
  title: string;
  type: SearchType;
  url: string;
  icon: ReactElement;
  path: string;
  searchHook: (query: SearchParamsBody) => UseQueryResult<ResultType>;
}

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

interface Props {
  subtypes: SubType[];
}

const SubNavigation = ({ subtypes }: Props) => {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <StyledPageContent variant="page" asChild consumeCss aria-label={t("searchForm.searchTypes")}>
      <nav>
        <StyledList>
          {subtypes.map((subtype) => {
            const currentPage = subtype.url.startsWith(location.pathname);
            return (
              <ItemWrapper key={subtype.type}>
                {subtype.icon}
                <SafeLinkButton
                  to={subtype.url}
                  variant={currentPage ? "primary" : "secondary"}
                  aria-current={currentPage}
                  css={linkOverlay.raw()}
                >
                  {subtype.title}
                </SafeLinkButton>
              </ItemWrapper>
            );
          })}
        </StyledList>
      </nav>
    </StyledPageContent>
  );
};

export default SubNavigation;
