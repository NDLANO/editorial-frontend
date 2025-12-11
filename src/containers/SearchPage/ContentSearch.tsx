/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DraftSearchParamsDTO } from "@ndla/types-backend/search-api";
import { keyBy } from "@ndla/util";
import { useSearchWithCustomSubjectsFiltering } from "../../modules/search/searchQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import SearchContentForm from "./components/form/SearchContentForm";
import { GenericSearchList } from "./components/GenericSearchList";
import SearchContent from "./components/results/SearchContent";
import SearchListOptions from "./components/results/SearchListOptions";
import { SearchPageContainer } from "./components/SearchPageContainer";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import config from "../../config";
import { useUserData } from "../../modules/draft/draftQueries";
import { useNodes } from "../../modules/nodes/nodeQueries";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";
import SearchSort, { SortType } from "./components/sort/SearchSort";
import Pagination from "../../components/abstractions/Pagination";
import { useAuth0Users } from "../../modules/auth0/auth0Queries";

export const Component = () => <PrivateRoute component={<ContentSearch />} />;

const SORT_TYPES: SortType[] = ["id", "relevance", "title", "lastUpdated", "revisionDate", "favorited", "published"];

const DEFAULT_PARAMS: DraftSearchParamsDTO = {
  fallback: false,
  page: 1,
  pageSize: 10,
  license: config.licenseAll,
  sort: "-lastUpdated",
  excludeRevisionLog: false,
  filterInactive: true,
};

export const ContentSearch = () => {
  const { t, i18n } = useTranslation();
  const [params, setParams] = useStableSearchPageParams();
  const { taxonomyVersion } = useTaxonomyVersion();

  const subjectsQuery = useNodes({
    language: i18n.language,
    nodeType: "SUBJECT",
    taxonomyVersion,
  });

  const parsedParams = useMemo(() => {
    const parsed: DraftSearchParamsDTO = {
      fallback: DEFAULT_PARAMS.fallback,
      draftStatus: params.get("draft-status")?.split(",") ?? undefined,
      resourceTypes: params.get("resource-types")?.split(",") ?? undefined,
      page: Number(params.get("page")) || DEFAULT_PARAMS.page,
      pageSize: Number(params.get("page-size")) || DEFAULT_PARAMS.pageSize,
      sort: (params.get("sort") ?? DEFAULT_PARAMS.sort) as DraftSearchParamsDTO["sort"],
      revisionDateFrom: params.get("revision-date-from") ?? undefined,
      revisionDateTo: params.get("revision-date-to") ?? undefined,
      excludeRevisionLog: params.get("exclude-revision-log") === "true" ? true : DEFAULT_PARAMS.excludeRevisionLog,
      responsibleIds: params.get("responsible-ids")?.split(",") ?? undefined,
      filterInactive: params.get("filter-inactive") === "false" ? false : DEFAULT_PARAMS.filterInactive,
      query: params.get("query") ?? undefined,
      language: params.get("language") ?? undefined,
      articleTypes: params.get("article-types")?.split(",") ?? undefined,
      subjects: params.get("subjects")?.split(",") ?? undefined,
      users: params.get("users")?.split(",") ?? undefined,
      license: params.get("license") ?? DEFAULT_PARAMS.license,
    };
    return parsed;
  }, [params]);

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
        <SearchSort
          sortTypes={SORT_TYPES}
          value={params.get("sort") ?? DEFAULT_PARAMS.sort!}
          onValueChange={(value) => setParams({ sort: value === DEFAULT_PARAMS.sort ? null : value })}
        />
        <SearchListOptions totalCount={searchQuery.data?.totalCount} defaultValue={DEFAULT_PARAMS.pageSize!} />
        <GenericSearchList
          type="content"
          loading={searchQuery.isLoading}
          error={searchQuery.error}
          query={params.get("query")}
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
          page={parsedParams.page}
          onPageChange={(details) =>
            setParams({ page: details.page === DEFAULT_PARAMS.page ? null : details.page.toString() })
          }
          pageSize={searchQuery.data?.pageSize}
          count={searchQuery.data?.totalCount ?? 0}
          siblingCount={1}
        />
      </main>
    </SearchPageContainer>
  );
};
