/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Tabs from "@ndla/tabs";
import ConceptListTabContent from "./ConceptListTabContent";
import WorkListTabContent from "./WorkListTabContent";
import {
  STORED_FILTER_WORKLIST,
  STORED_FILTER_WORKLIST_CONCEPT,
  STORED_PAGE_SIZE,
  STORED_PAGE_SIZE_CONCEPT,
  STORED_PAGE_SIZE_ON_HOLD,
  STORED_PRIORITIZED,
  STORED_SORT_OPTION_WORKLIST,
  STORED_SORT_OPTION_WORKLIST_CONCEPT,
  STORED_SORT_OPTION_WORKLIST_ON_HOLD,
} from "../../../../constants";
import { useSearchConcepts } from "../../../../modules/concept/conceptQueries";
import { useSearch } from "../../../../modules/search/searchQueries";
import {
  useStoredPageSizeHook,
  useStoredSortOptionHook,
  useStoredSubjectFilterHook,
  useStoredToggleHook,
} from "../../hooks/storedFilterHooks";

interface Props {
  ndlaId: string;
}
export type SortOption = "title" | "responsibleLastUpdated" | "status";

const WorkList = ({ ndlaId }: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  // Worklist articles
  const { filterSubject, setFilterSubject } = useStoredSubjectFilterHook(STORED_FILTER_WORKLIST, language);
  const { pageSize, setPageSize } = useStoredPageSizeHook(STORED_PAGE_SIZE);
  const { sortOption, setSortOption } = useStoredSortOptionHook<SortOption>(
    STORED_SORT_OPTION_WORKLIST,
    "-responsibleLastUpdated",
  );
  const { isOn: prioritized, setIsOn: setPrioritized } = useStoredToggleHook(STORED_PRIORITIZED);
  const [page, setPage] = useState(1);

  // Worklist concepts
  const { filterSubject: filterConceptSubject, setFilterSubject: setFilterConceptSubject } = useStoredSubjectFilterHook(
    STORED_FILTER_WORKLIST_CONCEPT,
    language,
  );
  const { pageSize: pageSizeConcept, setPageSize: setPageSizeConcept } =
    useStoredPageSizeHook(STORED_PAGE_SIZE_CONCEPT);
  const { sortOption: sortOptionConcepts, setSortOption: setSortOptionConcepts } = useStoredSortOptionHook<SortOption>(
    STORED_SORT_OPTION_WORKLIST_CONCEPT,
    "-responsibleLastUpdated",
  );
  const [pageConcept, setPageConcept] = useState(1);

  // Worklist on hold
  const { pageSize: pageSizeOnHold, setPageSize: setPageSizeOnHold } = useStoredPageSizeHook(STORED_PAGE_SIZE_ON_HOLD);
  const { sortOption: sortOptionOnHold, setSortOption: setSortOptionOnHold } = useStoredSortOptionHook<SortOption>(
    STORED_SORT_OPTION_WORKLIST_ON_HOLD,
    "-responsibleLastUpdated",
  );
  const [pageOnHold, setPageOnHold] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filterSubject, pageSize]);

  useEffect(() => {
    setPageConcept(1);
  }, [filterConceptSubject, pageSizeConcept]);

  const searchQuery = useSearch(
    {
      "responsible-ids": ndlaId,
      sort: sortOption,
      ...(prioritized ? { priority: "prioritized" } : { priority: "prioritized,unspecified" }),
      ...(filterSubject ? { subjects: filterSubject.value } : {}),
      page: page,
      "page-size": Number(pageSize!.value),
      language,
      fallback: true,
      "aggregate-paths": "contexts.rootId",
    },
    { enabled: !!ndlaId },
  );

  const searchConceptsQuery = useSearchConcepts(
    {
      "responsible-ids": ndlaId,
      sort: sortOptionConcepts,
      ...(filterConceptSubject ? { subjects: filterConceptSubject.value } : {}),
      page: pageConcept,
      "page-size": Number(pageSizeConcept!.value),
      language,
      fallback: true,
    },
    { enabled: !!ndlaId },
  );

  const searchOnHoldQuery = useSearch(
    {
      "responsible-ids": ndlaId,
      sort: sortOptionOnHold,
      priority: "on-hold",
      page: pageOnHold,
      "page-size": Number(pageSizeOnHold!.value),
      language,
      fallback: true,
    },
    { enabled: !!ndlaId },
  );

  const searchError = useMemo(() => {
    if (searchQuery.isError) {
      return t("welcomePage.errorMessage");
    }
  }, [searchQuery.isError, t]);

  const searchConceptsError = useMemo(() => {
    if (searchConceptsQuery.isError) {
      return t("welcomePage.errorMessage");
    }
  }, [searchConceptsQuery.isError, t]);

  const searchOnHoldError = useMemo(() => {
    if (searchOnHoldQuery.isError) {
      return t("welcomePage.errorMessage");
    }
  }, [searchOnHoldQuery.isError, t]);

  return (
    <Tabs
      variant="rounded"
      aria-label={t("welcomePage.workList.ariaLabel")}
      tabs={[
        {
          title: `${t("taxonomy.resources")} (${searchQuery.data?.totalCount ?? 0})`,
          id: "articles",
          content: (
            <WorkListTabContent
              data={searchQuery.data}
              filterSubject={filterSubject}
              setSortOption={setSortOption}
              setFilterSubject={setFilterSubject}
              isLoading={searchQuery.isLoading}
              error={searchError}
              sortOption={sortOption}
              ndlaId={ndlaId}
              setPage={setPage}
              setPrioritized={setPrioritized}
              prioritized={prioritized}
              pageSize={pageSize}
              setPageSize={setPageSize}
            />
          ),
        },
        {
          title: `${t("welcomePage.workList.onHold")} (${searchOnHoldQuery.data?.totalCount ?? 0})`,
          id: "onHold",
          content: (
            <WorkListTabContent
              data={searchOnHoldQuery.data}
              setSortOption={setSortOptionOnHold}
              isLoading={searchOnHoldQuery.isLoading}
              error={searchOnHoldError}
              sortOption={sortOptionOnHold}
              ndlaId={ndlaId}
              setPage={setPageOnHold}
              pageSize={pageSizeOnHold}
              setPageSize={setPageSizeOnHold}
              headerText="welcomePage.workList.onHoldHeading"
              descriptionText="welcomePage.workList.onHoldDescription"
            />
          ),
        },
        {
          title: `${t("form.name.concepts")} (${searchConceptsQuery.data?.totalCount ?? 0})`,
          id: "concepts",
          content: (
            <ConceptListTabContent
              data={searchConceptsQuery.data}
              setSortOption={setSortOptionConcepts}
              isLoading={searchConceptsQuery.isLoading}
              error={searchConceptsError}
              sortOption={sortOptionConcepts}
              filterSubject={filterConceptSubject}
              setFilterSubject={setFilterConceptSubject}
              ndlaId={ndlaId}
              setPageConcept={setPageConcept}
              pageSizeConcept={pageSizeConcept}
              setPageSizeConcept={setPageSizeConcept}
            />
          ),
        },
      ]}
    />
  );
};

export default WorkList;
