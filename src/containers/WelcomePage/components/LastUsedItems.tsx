/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import orderBy from "lodash/orderBy";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SingleValue } from "@ndla/select";
import Tabs from "@ndla/tabs";
import { IConceptSearchResult, IConceptSummary } from "@ndla/types-backend/concept-api";
import { IArticleSummary, ISearchResult } from "@ndla/types-backend/draft-api";
import LastUsedConcepts from "./LastUsedConcepts";
import LastUsedResources from "./LastUsedResources";
import { Prefix, TitleElement } from "./TableComponent";
import { defaultPageSize } from "./worklist/WorkList";
import {
  STORED_PAGE_SIZE_LAST_UPDATED,
  STORED_PAGE_SIZE_LAST_UPDATED_CONCEPT,
  STORED_SORT_OPTION_LAST_USED,
  STORED_SORT_OPTION_LAST_USED_CONCEPT,
} from "../../../constants";
import { useSearchConcepts } from "../../../modules/concept/conceptQueries";
import { useSearchDrafts } from "../../../modules/draft/draftQueries";

export type SortOptionLastUsed = "title" | "lastUpdated";

const getLastPage = (pageSize: number, res?: ISearchResult | IConceptSearchResult) =>
  res?.results.length ? Math.ceil(res.results.length / pageSize) : 1;

type SortOptionType = Prefix<"-", SortOptionLastUsed>;

const getSortedPaginationData = <T extends IConceptSummary | IArticleSummary>(
  page: number,
  sortOption: SortOptionType,
  data: T[],
  pageSize: number,
): T[] => {
  const sortDesc = sortOption.charAt(0) === "-";
  // Pagination logic. startIndex indicates start position in data.results for current page
  // currentPageElements is data to be displayed at current page
  const startIndex = page > 1 ? (page - 1) * pageSize : 0;
  const currentPageElements = data.slice(startIndex, startIndex + pageSize);

  return orderBy(
    currentPageElements,
    (e) => (sortOption.includes("title") ? e.title?.title : "updated" in e ? e.updated : e.lastUpdated),
    [sortDesc ? "desc" : "asc"],
  );
};
interface Props {
  lastUsedResources?: number[];
  lastUsedConcepts?: string[];
}

const LastUsedItems = ({ lastUsedResources = [], lastUsedConcepts = [] }: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const storedPageSize = localStorage.getItem(STORED_PAGE_SIZE_LAST_UPDATED);
  const [sortOption, _setSortOption] = useState<SortOptionType>(
    (localStorage.getItem(STORED_SORT_OPTION_LAST_USED) as SortOptionType) || "-lastUpdated",
  );
  const [page, setPage] = useState(1);
  const [pageSize, _setPageSize] = useState<SingleValue>(
    storedPageSize
      ? {
          label: storedPageSize,
          value: storedPageSize,
        }
      : defaultPageSize,
  );

  const storedPageSizeConcept = localStorage.getItem(STORED_PAGE_SIZE_LAST_UPDATED_CONCEPT);
  const [sortOptionConcept, _setSortOptionConcept] = useState<SortOptionType>(
    (localStorage.getItem(STORED_SORT_OPTION_LAST_USED_CONCEPT) as SortOptionType) || "-lastUpdated",
  );
  const [pageConcept, setPageConcept] = useState(1);
  const [pageSizeConcept, _setPageSizeConcept] = useState<SingleValue>(
    storedPageSizeConcept
      ? {
          label: storedPageSizeConcept,
          value: storedPageSizeConcept,
        }
      : defaultPageSize,
  );
  const searchDraftsQuery = useSearchDrafts(
    {
      ids: lastUsedResources!,
      sort: "-lastUpdated",
      language,
      pageSize: Number(pageSize!.value),
    },
    { enabled: !!lastUsedResources.length },
  );

  const searchConceptsQuery = useSearchConcepts(
    { ids: lastUsedConcepts.join(",")!, sort: "-lastUpdated", language },
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

  const lastPage = useMemo(
    () => getLastPage(Number(pageSize!.value), searchDraftsQuery.data),
    [searchDraftsQuery.data, pageSize],
  );
  const lastPageConcepts = useMemo(
    () => getLastPage(Number(pageSizeConcept!.value), searchConceptsQuery.data),
    [searchConceptsQuery.data, pageSizeConcept],
  );

  const tableTitles: TitleElement<SortOptionLastUsed>[] = [
    { title: t("form.name.title"), sortableField: "title" },
    {
      title: t("welcomePage.updated"),
      sortableField: "lastUpdated",
      width: "40%",
    },
  ];

  const setSortOption = useCallback((s: SortOptionType) => {
    _setSortOption(s);
    localStorage.setItem(STORED_SORT_OPTION_LAST_USED, s);
  }, []);

  const setSortOptionConcept = useCallback((s: SortOptionType) => {
    _setSortOptionConcept(s);
    localStorage.setItem(STORED_SORT_OPTION_LAST_USED_CONCEPT, s);
  }, []);

  const setPageSize = useCallback((p: SingleValue) => {
    if (!p) return;
    _setPageSize(p);
    localStorage.setItem(STORED_PAGE_SIZE_LAST_UPDATED, p.value);
  }, []);

  const setPageSizeConcept = useCallback((p: SingleValue) => {
    if (!p) return;
    _setPageSizeConcept(p);
    localStorage.setItem(STORED_PAGE_SIZE_LAST_UPDATED_CONCEPT, p.value);
  }, []);

  return (
    <Tabs
      variant="rounded"
      aria-label={t("welcomePage.lastUsed")}
      tabs={[
        {
          title: `${t("taxonomy.resources")} (${searchDraftsQuery.data?.totalCount ?? 0})`,
          id: "articles",
          content: (
            <LastUsedResources
              data={sortedData}
              isLoading={searchDraftsQuery.isLoading}
              page={page}
              setPage={setPage}
              lastPage={lastPage}
              sortOption={sortOption}
              setSortOption={setSortOption}
              error={draftsError}
              titles={tableTitles}
              pageSize={pageSize}
              setPageSize={setPageSize}
            />
          ),
        },
        {
          title: `${t("form.name.concepts")} (${searchConceptsQuery.data?.totalCount ?? 0})`,
          id: "concepts",
          content: (
            <LastUsedConcepts
              data={sortedConceptsData}
              isLoading={searchConceptsQuery.isLoading}
              page={pageConcept}
              setPage={setPageConcept}
              sortOption={sortOptionConcept}
              setSortOption={setSortOptionConcept}
              error={conceptsError}
              lastPage={lastPageConcepts}
              titles={tableTitles}
              pageSize={pageSizeConcept}
              setPageSize={setPageSizeConcept}
            />
          ),
        },
      ]}
    />
  );
};

export default LastUsedItems;
