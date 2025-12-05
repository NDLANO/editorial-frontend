/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { keyBy } from "@ndla/util";
import { useSearchWithCustomSubjectsFiltering } from "../../modules/search/searchQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import SearchContentForm from "./components/form/SearchContentForm";
import { parseSearchParams } from "./components/form/SearchForm";
import { GenericSearchList } from "./components/GenericSearchList";
import SearchContent from "./components/results/SearchContent";
import SearchListOptions from "./components/results/SearchListOptions";
import { SearchPageContainer } from "./components/SearchPageContainer";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import { useUserData } from "../../modules/draft/draftQueries";
import { useNodes } from "../../modules/nodes/nodeQueries";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";
import SearchSort from "./components/sort/SearchSort";
import Pagination from "../../components/abstractions/Pagination";
import { useAuth0Users } from "../../modules/auth0/auth0Queries";

export const Component = () => <PrivateRoute component={<ContentSearch />} />;

export const ContentSearch = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [params, setParams] = useStableSearchPageParams();
  const { taxonomyVersion } = useTaxonomyVersion();

  const subjectsQuery = useNodes({
    language: i18n.language,
    nodeType: "SUBJECT",
    taxonomyVersion,
  });

  const parsedParams = parseSearchParams(location.search, true);

  const searchQuery = useSearchWithCustomSubjectsFiltering(parsedParams);
  useSearchWithCustomSubjectsFiltering({ ...parsedParams, page: parsedParams.page ? parsedParams.page + 1 : 2 }); // preload next page.

  const userDataQuery = useUserData({
    enabled: isActiveToken(getAccessToken()),
  });

  const responsibleIds = useMemo(() => {
    if (!searchQuery.data?.results) return [];
    return searchQuery.data.results.reduce<string[]>((acc, curr) => {
      if (curr.responsible) {
        acc.push(curr.responsible.responsibleId);
      }
      return acc;
    }, []);
  }, [searchQuery.data?.results]);

  const auth0Responsibles = useAuth0Users({ uniqueUserIds: responsibleIds.join(",") }, {});

  const keyedResponsibles = useMemo(() => {
    return keyBy(auth0Responsibles.data, (responsible) => responsible.app_metadata.ndla_id);
  }, [auth0Responsibles.data]);

  return (
    <SearchPageContainer asChild consumeCss>
      <main>
        <title>{t("htmlTitles.search.content")}</title>
        <SearchContentForm userData={userDataQuery.data} subjects={subjectsQuery.data ?? []} />
        <SearchSort type="content" />
        <SearchListOptions totalCount={searchQuery.data?.totalCount} />
        <GenericSearchList
          type="content"
          loading={searchQuery.isLoading}
          error={searchQuery.error}
          resultLength={searchQuery.data?.totalCount ?? 0}
        >
          {searchQuery.data?.results.map((result) => (
            <SearchContent
              key={`${result.id}-${result.learningResourceType}`}
              content={result}
              responsibleName={
                result.responsible ? keyedResponsibles[result.responsible.responsibleId]?.name : undefined
              }
            />
          ))}
        </GenericSearchList>
        <Pagination
          page={Number(params.get("page")) || 1}
          onPageChange={(details) => setParams({ page: details.page.toString() })}
          pageSize={searchQuery.data?.pageSize}
          count={searchQuery.data?.totalCount ?? 0}
          siblingCount={1}
        />
      </main>
    </SearchPageContainer>
  );
};
