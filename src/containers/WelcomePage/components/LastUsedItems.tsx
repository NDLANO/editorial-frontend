/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { orderBy } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import { IConceptSummaryDTO } from "@ndla/types-backend/concept-api";
import { IArticleSummaryDTO } from "@ndla/types-backend/draft-api";
import LastUsedConcepts from "./LastUsedConcepts";
import LastUsedResources from "./LastUsedResources";
import { Prefix, TitleElement } from "./TableComponent";
import { WelcomePageTabsContent } from "./WelcomePageTabsContent";
import {
  STORED_PAGE_SIZE_LAST_UPDATED,
  STORED_PAGE_SIZE_LAST_UPDATED_CONCEPT,
  STORED_SORT_OPTION_LAST_USED,
  STORED_SORT_OPTION_LAST_USED_CONCEPT,
} from "../../../constants";
import { useSearchConcepts } from "../../../modules/concept/conceptQueries";
import { useSearchDrafts } from "../../../modules/draft/draftQueries";
import { useLocalStoragePageSizeState, useLocalStorageSortOptionState } from "../hooks/storedFilterHooks";
import { SortOptionLastUsed } from "../types";

type SortOptionType = Prefix<"-", SortOptionLastUsed>;

export const getCurrentPageData = <T,>(page: number, data: T[], pageSize: number): T[] => {
  // Pagination logic. startIndex indicates start position in data for current page
  // currentPageElements is data to be displayed at current page
  const startIndex = page > 1 ? (page - 1) * pageSize : 0;
  const currentPageElements = data.slice(startIndex, startIndex + pageSize);
  return currentPageElements ?? [];
};

const getSortedPaginationData = <T extends IConceptSummaryDTO | IArticleSummaryDTO>(
  page: number,
  sortOption: SortOptionType,
  data: T[],
  pageSize: number,
): T[] => {
  const sortDesc = sortOption.charAt(0) === "-";
  const currentPageElements = getCurrentPageData(page, data, pageSize);

  return orderBy(
    currentPageElements,
    (e) =>
      sortOption.includes("title")
        ? e.title?.title
        : sortOption.includes("status")
          ? e.status.current
          : "updated" in e
            ? e.updated
            : e.lastUpdated,
    [sortDesc ? "desc" : "asc"],
  );
};
interface Props {
  lastUsedResources?: number[];
  lastUsedConcepts?: number[];
}

const LastUsedItems = ({ lastUsedResources = [], lastUsedConcepts = [] }: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  // Last used articles state handling
  const [pageSize, setPageSize] = useLocalStoragePageSizeState(STORED_PAGE_SIZE_LAST_UPDATED);
  const [sortOption, setSortOption] = useLocalStorageSortOptionState<SortOptionLastUsed>(
    STORED_SORT_OPTION_LAST_USED,
    "-lastUpdated",
  );
  const [page, setPage] = useState(1);

  // Last used concepts state handling
  const [pageSizeConcept, setPageSizeConcept] = useLocalStoragePageSizeState(STORED_PAGE_SIZE_LAST_UPDATED_CONCEPT);
  const [sortOptionConcept, setSortOptionConcept] = useLocalStorageSortOptionState<SortOptionLastUsed>(
    STORED_SORT_OPTION_LAST_USED_CONCEPT,
    "-lastUpdated",
  );
  const [pageConcept, setPageConcept] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    setPageConcept(1);
  }, [pageSizeConcept]);

  const searchDraftsQuery = useSearchDrafts(
    {
      ids: lastUsedResources!,
      sort: "-lastUpdated",
      language,
      pageSize: lastUsedResources.length,
      fallback: true,
    },
    { enabled: !!lastUsedResources.length },
  );

  const searchConceptsQuery = useSearchConcepts(
    { ids: lastUsedConcepts, sort: "-lastUpdated", language, pageSize: lastUsedConcepts.length },
    {
      enabled: !!lastUsedConcepts.length,
    },
  );

  const draftsError = useMemo(() => {
    if (searchDraftsQuery.isError) {
      return t("welcomePage.errorMessage");
    }
  }, [searchDraftsQuery.isError, t]);

  const conceptsError = useMemo(() => {
    if (searchConceptsQuery.isError) {
      return t("welcomePage.errorMessage");
    }
  }, [searchConceptsQuery.isError, t]);

  const sortedData = useMemo(
    () =>
      searchDraftsQuery.data?.results
        ? getSortedPaginationData(page, sortOption, searchDraftsQuery.data.results, Number(pageSize!.value))
        : [],
    [searchDraftsQuery.data, page, sortOption, pageSize],
  );

  const sortedConceptsData = useMemo(
    () =>
      searchConceptsQuery.data?.results
        ? getSortedPaginationData(
            pageConcept,
            sortOptionConcept,
            searchConceptsQuery.data.results,
            Number(pageSizeConcept!.value),
          )
        : [],
    [searchConceptsQuery.data, pageConcept, sortOptionConcept, pageSizeConcept],
  );

  const tableTitles: TitleElement<SortOptionLastUsed>[] = [
    { title: t("form.name.title"), sortableField: "title" },
    { title: t("welcomePage.workList.status"), sortableField: "status", width: "20%" },
    {
      title: t("welcomePage.updated"),
      sortableField: "lastUpdated",
      width: "20%",
    },
  ];

  return (
    <TabsRoot
      variant="outline"
      translations={{
        listLabel: t("welcomePage.listLabels.lastUsed"),
      }}
      defaultValue="articles"
    >
      <TabsList>
        <TabsTrigger value="articles">
          {`${t("taxonomy.resources")} (${searchDraftsQuery.data?.totalCount ?? 0})`}
        </TabsTrigger>
        <TabsTrigger value="concepts">
          {`${t("form.name.concepts")} (${searchConceptsQuery.data?.totalCount ?? 0})`}
        </TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <WelcomePageTabsContent value="articles">
        <LastUsedResources
          data={sortedData}
          isPending={searchDraftsQuery.isPending}
          page={page}
          setPage={setPage}
          sortOption={sortOption}
          setSortOption={setSortOption}
          error={draftsError}
          titles={tableTitles}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalCount={searchDraftsQuery.data?.totalCount}
        />
      </WelcomePageTabsContent>
      <WelcomePageTabsContent value="concepts">
        <LastUsedConcepts
          data={sortedConceptsData}
          isPending={searchConceptsQuery.isPending}
          page={pageConcept}
          setPage={setPageConcept}
          sortOption={sortOptionConcept}
          setSortOption={setSortOptionConcept}
          error={conceptsError}
          titles={tableTitles}
          pageSize={pageSizeConcept}
          setPageSize={setPageSizeConcept}
          totalCount={searchConceptsQuery.data?.totalCount}
        />
      </WelcomePageTabsContent>
    </TabsRoot>
  );
};

export default LastUsedItems;
