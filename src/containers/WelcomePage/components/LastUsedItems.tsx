/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import LastUsedConcepts from "./LastUsedConcepts";
import LastUsedResources from "./LastUsedResources";
import { TitleElement } from "./TableComponent";
import { WelcomePageTabsContent } from "./WelcomePageTabsContent";
import { useSearchConcepts } from "../../../modules/concept/conceptQueries";
import { useDraftIds } from "../../../modules/draft/draftQueries";
import { SortOptionLastUsed } from "../types";
import { LastUsedLearningpaths } from "./LastUsedLearningpaths";
import { useSearch } from "../../../modules/search/searchQueries";

interface Props {
  lastUsedResources?: number[];
  lastUsedConcepts?: number[];
  lastUsedLearningpaths?: number[];
}

const LastUsedItems = ({ lastUsedResources = [], lastUsedConcepts = [], lastUsedLearningpaths = [] }: Props) => {
  const { t, i18n } = useTranslation();

  const searchDraftsQuery = useDraftIds(
    {
      ids: lastUsedResources!,
      language: i18n.language,
    },
    { enabled: !!lastUsedResources.length },
  );

  const searchConceptsQuery = useSearchConcepts(
    { ids: lastUsedConcepts, sort: "-lastUpdated", language: i18n.language, pageSize: lastUsedConcepts.length },
    { enabled: !!lastUsedConcepts.length },
  );

  const searchLearningpathsQuery = useSearch(
    {
      ids: lastUsedLearningpaths,
      resultTypes: ["learningpath"],
      license: "all",
      filterInactive: false,
      language: i18n.language,
    },
    { enabled: !!lastUsedLearningpaths.length },
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

  const learningpathsError = useMemo(() => {
    if (searchLearningpathsQuery.isError) {
      return t("welcomePage.errorMessage");
    }
  }, [searchLearningpathsQuery.isError, t]);

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
          {`${t("taxonomy.resources")} (${searchDraftsQuery.data?.length ?? 0})`}
        </TabsTrigger>
        <TabsTrigger value="concepts">
          {`${t("form.name.concepts")} (${searchConceptsQuery.data?.totalCount ?? 0})`}
        </TabsTrigger>
        <TabsTrigger value="learningpaths">
          {`${t("form.name.learningpaths")} (${searchLearningpathsQuery.data?.totalCount ?? 0})`}
        </TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <WelcomePageTabsContent value="articles">
        <LastUsedResources
          data={searchDraftsQuery.data ?? []}
          isLoading={searchDraftsQuery.isLoading}
          error={draftsError}
          titles={tableTitles}
          totalCount={searchDraftsQuery.data?.length ?? 0}
        />
      </WelcomePageTabsContent>
      <WelcomePageTabsContent value="concepts">
        <LastUsedConcepts
          data={searchConceptsQuery.data?.results ?? []}
          isLoading={searchConceptsQuery.isLoading}
          error={conceptsError}
          titles={tableTitles}
          totalCount={searchConceptsQuery.data?.totalCount}
        />
      </WelcomePageTabsContent>
      <WelcomePageTabsContent value="learningpaths">
        <LastUsedLearningpaths
          data={searchLearningpathsQuery.data?.results ?? []}
          isLoading={searchLearningpathsQuery.isLoading}
          error={learningpathsError}
          titles={tableTitles}
          totalCount={searchLearningpathsQuery.data?.totalCount}
        />
      </WelcomePageTabsContent>
    </TabsRoot>
  );
};

export default LastUsedItems;
