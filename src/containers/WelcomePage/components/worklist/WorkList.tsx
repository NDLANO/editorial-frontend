/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import ConceptListTabContent from "./ConceptListTabContent";
import WorkListTabContent from "./WorkListTabContent";
import {
  STORED_FILTER_WORKLIST,
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
  useLocalStoragePageSizeState,
  useLocalStorageSortOptionState,
  useLocalStorageSubjectFilterState,
  useLocalStorageBooleanState,
} from "../../hooks/storedFilterHooks";
import { WelcomePageTabsContent } from "../WelcomePageTabsContent";

interface Props {
  ndlaId: string;
}
export type SortOptionWorkList =
  | "title"
  | "responsibleLastUpdated"
  | "status"
  | "resourceType"
  | "parentTopicName"
  | "primaryRoot";

export type SortOptionConceptList = "title" | "responsibleLastUpdated" | "status" | "subject" | "conceptType";

const StyledTabsRoot = styled(TabsRoot, {
  base: {
    gridColumn: "1 / -1",
  },
});

const WorkList = ({ ndlaId }: Props) => {
  const { t, i18n } = useTranslation();

  // Worklist articles state handling
  const [filterSubject, setFilterSubject] = useLocalStorageSubjectFilterState(STORED_FILTER_WORKLIST, i18n.language);
  const [pageSize, setPageSize] = useLocalStoragePageSizeState(STORED_PAGE_SIZE);
  const [sortOption, setSortOption] = useLocalStorageSortOptionState<SortOptionWorkList>(
    STORED_SORT_OPTION_WORKLIST,
    "-responsibleLastUpdated",
  );
  const [prioritized, setPrioritized] = useLocalStorageBooleanState(STORED_PRIORITIZED);
  const [page, setPage] = useState(1);

  // Worklist concepts state handling
  const [pageSizeConcept, setPageSizeConcept] = useLocalStoragePageSizeState(STORED_PAGE_SIZE_CONCEPT);
  const [sortOptionConcepts, setSortOptionConcepts] = useLocalStorageSortOptionState<SortOptionConceptList>(
    STORED_SORT_OPTION_WORKLIST_CONCEPT,
    "-responsibleLastUpdated",
  );
  const [pageConcept, setPageConcept] = useState(1);

  // Worklist on hold state handling
  const [pageSizeOnHold, setPageSizeOnHold] = useLocalStoragePageSizeState(STORED_PAGE_SIZE_ON_HOLD);
  const [sortOptionOnHold, setSortOptionOnHold] = useLocalStorageSortOptionState<SortOptionWorkList>(
    STORED_SORT_OPTION_WORKLIST_ON_HOLD,
    "-responsibleLastUpdated",
  );
  const [pageOnHold, setPageOnHold] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filterSubject, pageSize]);

  const searchQuery = useSearch(
    {
      responsibleIds: [ndlaId],
      sort: sortOption,
      ...(prioritized ? { priority: ["prioritized"] } : { priority: ["prioritized", "unspecified"] }),
      ...(filterSubject ? { subjects: [filterSubject.value] } : {}),
      page: page,
      pageSize: Number(pageSize!.value),
      language: i18n.language,
      fallback: true,
    },
    { enabled: !!ndlaId },
  );

  const searchConceptsQuery = useSearchConcepts(
    {
      responsibleIds: [ndlaId],
      sort: sortOptionConcepts,
      page: pageConcept,
      pageSize: Number(pageSizeConcept!.value),
      language: i18n.language,
      fallback: true,
    },
    { enabled: !!ndlaId },
  );

  const searchOnHoldQuery = useSearch(
    {
      responsibleIds: [ndlaId],
      sort: sortOptionOnHold,
      priority: ["on-hold"],
      page: pageOnHold,
      pageSize: Number(pageSizeOnHold!.value),
      language: i18n.language,
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
    <StyledTabsRoot
      variant="outline"
      defaultValue="articles"
      translations={{
        listLabel: t("welcomePage.listLabels.worklist"),
      }}
    >
      <TabsList>
        <TabsTrigger value="articles">{`${t("taxonomy.resources")} (${searchQuery.data?.totalCount ?? 0})`}</TabsTrigger>
        <TabsTrigger value="onHold">{`${t("welcomePage.workList.onHold")} (${searchOnHoldQuery.data?.totalCount ?? 0})`}</TabsTrigger>
        <TabsTrigger value="concepts">{`${t("form.name.concepts")} (${searchConceptsQuery.data?.totalCount ?? 0})`}</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <WelcomePageTabsContent value="articles">
        <WorkListTabContent
          data={searchQuery.data}
          filterSubject={filterSubject}
          setSortOption={setSortOption}
          setFilterSubject={setFilterSubject}
          isPending={searchQuery.isPending}
          error={searchError}
          sortOption={sortOption}
          ndlaId={ndlaId}
          setPage={setPage}
          setPrioritized={setPrioritized}
          prioritized={prioritized}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </WelcomePageTabsContent>
      <WelcomePageTabsContent value="onHold">
        <WorkListTabContent
          data={searchOnHoldQuery.data}
          setSortOption={setSortOptionOnHold}
          isPending={searchOnHoldQuery.isPending}
          error={searchOnHoldError}
          sortOption={sortOptionOnHold}
          ndlaId={ndlaId}
          setPage={setPageOnHold}
          pageSize={pageSizeOnHold}
          setPageSize={setPageSizeOnHold}
          headerText="welcomePage.workList.onHoldHeading"
          descriptionText="welcomePage.workList.onHoldDescription"
        />
      </WelcomePageTabsContent>
      <WelcomePageTabsContent value="concepts">
        <ConceptListTabContent
          data={searchConceptsQuery.data}
          setSortOption={setSortOptionConcepts}
          isPending={searchConceptsQuery.isPending}
          error={searchConceptsError}
          sortOption={sortOptionConcepts}
          ndlaId={ndlaId}
          setPageConcept={setPageConcept}
          pageSizeConcept={pageSizeConcept}
          setPageSizeConcept={setPageSizeConcept}
        />
      </WelcomePageTabsContent>
    </StyledTabsRoot>
  );
};

export default WorkList;
