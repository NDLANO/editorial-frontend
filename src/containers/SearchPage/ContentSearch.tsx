/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DraftSearchParamsDTO } from "@ndla/types-backend/search-api";
import { keyBy, uniq } from "@ndla/util";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/abstractions/Pagination";
import config from "../../config";
import { DA_SUBJECT_ID, LMA_SUBJECT_ID, NO_RESPONSIBLES, PUBLISHED, SA_SUBJECT_ID } from "../../constants";
import { auth0UsersQueryOptions } from "../../modules/auth0/auth0Queries";
import { userDataQueryOptions } from "../../modules/draft/draftQueries";
import { nodesQueryOptions, searchNodesQueryOptions } from "../../modules/nodes/nodeQueries";
import { NoNodeDraftSearchParams } from "../../modules/search/searchApiInterfaces";
import { searchQueryOptions } from "../../modules/search/searchQueries";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";
import {
  customFieldsBody,
  defaultSubjectIdObject,
  getResultSubjectIdObject,
  getSubjectsIdsQuery,
} from "../WelcomePage/utils";
import SearchContentForm from "./components/form/SearchContentForm";
import { GenericSearchList } from "./components/GenericSearchList";
import SearchContent from "./components/results/SearchContent";
import SearchListOptions from "./components/results/SearchListOptions";
import { SearchPageContainer } from "./components/SearchPageContainer";
import SearchSort, { SortType } from "./components/sort/SearchSort";
import { useStableSearchPageParams } from "./useStableSearchPageParams";

export const Component = () => <PrivateRoute component={<ContentSearch />} />;

const SORT_TYPES: SortType[] = [
  "id",
  "relevance",
  "title",
  "lastUpdated",
  "firstPublished",
  "revisionDate",
  "favorited",
  "published",
];

const DEFAULT_PARAMS: DraftSearchParamsDTO = {
  fallback: false,
  page: 1,
  pageSize: 10,
  license: config.licenseAll,
  sort: "-lastUpdated",
  filterInactive: true,
};

const RELEVANT_SUBJECT_IDS = [LMA_SUBJECT_ID, DA_SUBJECT_ID, SA_SUBJECT_ID];

export const ContentSearch = () => {
  const { t, i18n } = useTranslation();
  const [params, setParams] = useStableSearchPageParams();
  const { taxonomyVersion } = useTaxonomyVersion();

  const subjectsQuery = useQuery(
    nodesQueryOptions({
      language: i18n.language,
      nodeType: ["SUBJECT"],
      taxonomyVersion,
    }),
  );

  const parsedParams = useMemo(() => {
    const responsibles = params.get("responsible-ids");
    const parsed: DraftSearchParamsDTO = {
      fallback: DEFAULT_PARAMS.fallback,
      draftStatus: params.get("draft-status")?.split(",") ?? undefined,
      resourceTypes: params.get("resource-types")?.split(",") ?? undefined,
      page: Number(params.get("page")) || DEFAULT_PARAMS.page,
      pageSize: Number(params.get("page-size")) || DEFAULT_PARAMS.pageSize,
      sort: (params.get("sort") ?? DEFAULT_PARAMS.sort) as DraftSearchParamsDTO["sort"],
      revisionDateFrom: params.get("revision-date-from") ?? undefined,
      revisionDateTo: params.get("revision-date-to") ?? undefined,
      responsibleIds: responsibles === NO_RESPONSIBLES ? [] : responsibles?.split(",") || undefined,
      query: params.get("query") ?? undefined,
      queryFields: params.get("query-fields")?.split(",") as DraftSearchParamsDTO["queryFields"] | undefined,
      language: params.get("language") ?? undefined,
      articleTypes: params.get("article-types")?.split(",") ?? undefined,
      subjects: params.get("subjects")?.split(",") ?? undefined,
      users: params.get("users")?.split(",") ?? undefined,
      license: params.get("license") ?? DEFAULT_PARAMS.license,
      traits: (params.get("traits")?.split(",") ?? undefined) as DraftSearchParamsDTO["traits"] | undefined,
    };
    return parsed;
  }, [params]);

  const userDataQuery = useQuery({
    ...userDataQueryOptions(),
    enabled: isActiveToken(getAccessToken()),
  });

  const searchNodesQuery = useQuery({
    ...searchNodesQueryOptions({ ...customFieldsBody(userDataQuery.data?.userId ?? ""), taxonomyVersion }),
    enabled: !!userDataQuery.data?.userId && RELEVANT_SUBJECT_IDS.includes(params.get("subjects") ?? ""),
  });

  const subjectIdObject = useMemo(() => {
    if (!userDataQuery.data?.userId || !searchNodesQuery.data) return defaultSubjectIdObject;
    return getResultSubjectIdObject(userDataQuery.data.userId, searchNodesQuery.data.results);
  }, [searchNodesQuery.data, userDataQuery.data?.userId]);

  const actualQueryParams: NoNodeDraftSearchParams = useMemo(() => {
    return {
      ...parsedParams,
      resultTypes: ["draft", "concept", "learningpath"],
      subjects: getSubjectsIdsQuery(parsedParams.subjects, userDataQuery.data?.favoriteSubjects, subjectIdObject),
      draftStatus: parsedParams.draftStatus?.map((s) => (s === "HAS_PUBLISHED" ? PUBLISHED : s)),
      includeOtherStatuses: !!(
        parsedParams.includeOtherStatuses ?? parsedParams.draftStatus?.some((s) => s === "HAS_PUBLISHED")
      ),
    };
  }, [parsedParams, subjectIdObject, userDataQuery.data?.favoriteSubjects]);

  const searchQuery = useQuery({
    ...searchQueryOptions(actualQueryParams),
    enabled: !userDataQuery.isLoading && !searchNodesQuery.isLoading,
  });
  useQuery({
    ...searchQueryOptions({ ...actualQueryParams, page: actualQueryParams.page ? actualQueryParams.page + 1 : 2 }),
    enabled: !userDataQuery.isLoading && !searchNodesQuery.isLoading,
  }); // preload next page.

  const responsibleIds = useMemo(() => {
    if (!searchQuery.data?.results) return [];
    return searchQuery.data.results.reduce<string[]>((acc, curr) => {
      if (curr.responsible) {
        acc.push(curr.responsible.responsibleId);
      }
      return acc;
    }, []);
  }, [searchQuery.data?.results]);

  const auth0Responsibles = useQuery({
    ...auth0UsersQueryOptions({ uniqueUserIds: uniq(responsibleIds).join(",") }),
  });

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
