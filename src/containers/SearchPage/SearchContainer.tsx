/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { UseQueryResult } from "@tanstack/react-query";
import { Search } from "@ndla/icons/common";
import { Pager } from "@ndla/pager";
import { HelmetWithTracker } from "@ndla/tracker";
import { IAudioSummarySearchResult, ISeriesSummarySearchResult } from "@ndla/types-backend/audio-api";
import { IConceptSearchResult } from "@ndla/types-backend/concept-api";
import { ISearchResultV3 } from "@ndla/types-backend/image-api";
import { IMultiSearchResult } from "@ndla/types-backend/search-api";
import { OneColumn } from "@ndla/ui";
import SearchForm, { parseSearchParams, SearchParams } from "./components/form/SearchForm";
import SearchList from "./components/results/SearchList";
import SearchListOptions from "./components/results/SearchListOptions";
import SearchSort from "./components/sort/SearchSort";
import SearchSaveButton from "./SearchSaveButton";
import { SearchType } from "../../interfaces";
import { useUserData } from "../../modules/draft/draftQueries";
import { useNodes } from "../../modules/nodes/nodeQueries";
import { getAccessToken, getAccessTokenPersonal } from "../../util/authHelpers";
import { isValid } from "../../util/jwtHelper";
import { toSearch } from "../../util/routeHelpers";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

const StyledSearchHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

export type ResultType =
  | ISearchResultV3
  | IConceptSearchResult
  | ISeriesSummarySearchResult
  | IAudioSummarySearchResult
  | IMultiSearchResult;

interface Props {
  type: SearchType;
  searchHook: (query: SearchParams) => UseQueryResult<ResultType>;
}

const SearchContainer = ({ searchHook, type }: Props) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const locale = i18n.language;
  const { taxonomyVersion } = useTaxonomyVersion();
  const { data: subjectData } = useNodes({
    language: locale,
    nodeType: "SUBJECT",
    taxonomyVersion,
  });

  const { data: userData } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });

  const [searchObject, setSearchObject] = useState(parseSearchParams(location.search));
  const { data: results, isLoading: isSearching, error: searchError } = searchHook(searchObject);
  const nextPage = (searchObject?.page ?? 1) + 1;
  // preload next page.
  searchHook({ ...searchObject, page: nextPage });
  useEffect(() => {
    setSearchObject(parseSearchParams(location.search));
  }, [location.search]);

  const subjects = subjectData ?? [];

  const onQueryPush = (newSearchObject: SearchParams) => {
    const searchQuery = {
      ...searchObject,
      ...newSearchObject,
    };

    // Remove unused/empty query params
    const newQuery = Object.entries(searchQuery).reduce((prev, [currKey, currVal]) => {
      const validValue = currVal !== "" && currVal !== undefined;
      return validValue ? { ...prev, [currKey]: currVal } : prev;
    }, {});
    setSearchObject(newQuery);
    navigate(toSearch(newQuery, type));
  };

  const onSortOrderChange = (sort: string): void => {
    onQueryPush({ ...searchObject, sort, page: 1 });
  };

  const lastPage = results?.totalCount ? Math.ceil(results?.totalCount / (results.pageSize ?? 1)) : 1;

  return (
    <>
      <HelmetWithTracker title={t(`htmlTitles.search.${type}`)} />
      <OneColumn>
        <StyledSearchHeader>
          <h2>
            <Search size="normal" />
            {t(`searchPage.header.${type}`)}
          </h2>
          <SearchSaveButton userData={userData} />
        </StyledSearchHeader>
        <SearchForm
          type={type}
          search={onQueryPush}
          searchObject={searchObject}
          locale={locale}
          subjects={subjects}
          userId={userData?.userId}
        />
        <SearchSort type={type} onSortOrderChange={onSortOrderChange} />
        <SearchListOptions
          type={type}
          searchObject={searchObject}
          totalCount={results?.totalCount}
          search={onQueryPush}
        />
        <SearchList
          searchObject={searchObject}
          results={results?.results ?? []}
          searching={isSearching}
          type={type}
          locale={locale}
          subjects={subjects}
          error={!!searchError}
        />
        <Pager page={searchObject.page ?? 1} lastPage={lastPage} query={searchObject} onClick={onQueryPush} />
      </OneColumn>
    </>
  );
};

export default SearchContainer;
