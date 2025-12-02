/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { UseQueryResult } from "@tanstack/react-query";
import { PageContainer } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import SearchForm, { parseSearchParams, SearchParamsBody } from "./components/form/SearchForm";
import SearchList, { ResultType } from "./components/results/SearchList";
import SearchListOptions from "./components/results/SearchListOptions";
import SearchSort from "./components/sort/SearchSort";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import Pagination from "../../components/abstractions/Pagination";
import { SearchType } from "../../interfaces";
import { useUserData } from "../../modules/draft/draftQueries";
import { useNodes } from "../../modules/nodes/nodeQueries";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

const StyledPageContainer = styled(PageContainer, {
  base: {
    paddingBlockStart: "0",
    gap: "xsmall",
  },
});

interface Props {
  type: SearchType;
  searchHook: (query: SearchParamsBody) => UseQueryResult<ResultType>;
}

const SearchContainer = ({ searchHook, type }: Props) => {
  const { t, i18n } = useTranslation();
  const [params, setParams] = useStableSearchPageParams();
  const location = useLocation();
  const locale = i18n.language;
  const { taxonomyVersion } = useTaxonomyVersion();
  const { data: subjectData } = useNodes({
    language: locale,
    nodeType: "SUBJECT",
    taxonomyVersion,
  });

  const { data: userData } = useUserData({
    enabled: isActiveToken(getAccessToken()),
  });

  const parsedParams = parseSearchParams(location.search, true);

  const { data: results, isLoading: isSearching, error: searchError } = searchHook(parsedParams);
  // preload next page.
  searchHook({ ...parsedParams, page: parsedParams.page ? parsedParams.page + 1 : 2 });

  const subjects = subjectData ?? [];

  const onSortOrderChange = (sort: string): void => {
    setParams({ sort });
  };

  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <title>{t(`htmlTitles.search.${type}`)}</title>
        <SearchForm type={type} locale={locale} subjects={subjects} userData={userData} />
        <SearchSort type={type} onSortOrderChange={onSortOrderChange} />
        <SearchListOptions totalCount={results?.totalCount} />
        <SearchList
          query={params.get("query")}
          results={results?.results ?? []}
          searching={isSearching}
          type={type}
          locale={locale}
          error={!!searchError}
        />
        <Pagination
          page={Number(params.get("page")) || 1}
          onPageChange={(details) => setParams({ page: details.page.toString() })}
          pageSize={results?.pageSize}
          count={results?.totalCount ?? 0}
          siblingCount={1}
        />
      </main>
    </StyledPageContainer>
  );
};

export default SearchContainer;
