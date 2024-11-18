/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import ArticleStatusContent from "./ArticleStatusContent";
import { WelcomePageTabsContent } from "./WelcomePageTabsContent";
import {
  DA_SUBJECT_ID,
  FAVOURITES_SUBJECT_ID,
  SA_SUBJECT_ID,
  LMA_SUBJECT_ID,
  STORED_FILTER_DA_SUBJECT,
  STORED_FILTER_FAVORITES,
  STORED_FILTER_LMA_SUBJECT,
  STORED_FILTER_SA_SUBJECT,
  STORED_ON_HOLD_DA_SUBJECT,
  STORED_ON_HOLD_FAVORITES,
  STORED_ON_HOLD_LMA_SUBJECT,
  STORED_ON_HOLD_SA_SUBJECT,
} from "../../../constants";
import { usePostSearchNodes } from "../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { SubjectIdObject, customFieldsBody } from "../utils";

interface Props {
  ndlaId: string;
  favoriteSubjects: string[] | undefined;
  userDataPending: boolean;
  subjectIdObject: SubjectIdObject;
}

const ArticleStatuses = ({ ndlaId, favoriteSubjects, userDataPending, subjectIdObject }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const searchQuery = usePostSearchNodes({ ...customFieldsBody(ndlaId), taxonomyVersion });

  const tabs = useMemo(() => {
    if (searchQuery.isPending) return [];

    const tabsList = [];

    if (subjectIdObject.subjectLMA.length) {
      tabsList.push({
        title: t("welcomePage.lmaSubjects"),
        id: "lma-subjects",
        content: (
          <ArticleStatusContent
            ndlaId={ndlaId}
            subjectIds={subjectIdObject.subjectLMA.map((s) => s.id)}
            title={t("welcomePage.lmaSubjectsHeading")}
            description={t("welcomePage.lmaSubjectsDescription")}
            searchPageSubjectFilter={LMA_SUBJECT_ID}
            localStorageKey={STORED_FILTER_LMA_SUBJECT}
            onHoldLocalStorageKey={STORED_ON_HOLD_LMA_SUBJECT}
          />
        ),
      });
    }

    if (subjectIdObject.subjectDA.length) {
      tabsList.push({
        title: t("welcomePage.daSubjects"),
        id: "desk-subjects",
        content: (
          <ArticleStatusContent
            ndlaId={ndlaId}
            subjectIds={subjectIdObject.subjectDA.map((s) => s.id)}
            title={t("welcomePage.daSubjectsHeading")}
            description={t("welcomePage.daSubjectsDescription")}
            searchPageSubjectFilter={DA_SUBJECT_ID}
            localStorageKey={STORED_FILTER_DA_SUBJECT}
            onHoldLocalStorageKey={STORED_ON_HOLD_DA_SUBJECT}
          />
        ),
      });
    }

    if (subjectIdObject.subjectSA.length) {
      tabsList.push({
        title: t("welcomePage.saSubjects"),
        id: "langauge-subjects",
        content: (
          <ArticleStatusContent
            ndlaId={ndlaId}
            subjectIds={subjectIdObject.subjectSA.map((s) => s.id)}
            title={t("welcomePage.saSubjectsHeading")}
            description={t("welcomePage.saSubjectsDescription")}
            searchPageSubjectFilter={SA_SUBJECT_ID}
            localStorageKey={STORED_FILTER_SA_SUBJECT}
            onHoldLocalStorageKey={STORED_ON_HOLD_SA_SUBJECT}
          />
        ),
      });
    }

    if (favoriteSubjects?.length) {
      tabsList.push({
        title: t("welcomePage.favoriteSubjects"),
        id: "favorite-subjects",
        content: (
          <ArticleStatusContent
            ndlaId={ndlaId}
            subjectIds={favoriteSubjects}
            title={t("welcomePage.favoriteSubjectsHeading")}
            description={t("welcomePage.favoriteSubjectsDescription")}
            searchPageSubjectFilter={FAVOURITES_SUBJECT_ID}
            localStorageKey={STORED_FILTER_FAVORITES}
            onHoldLocalStorageKey={STORED_ON_HOLD_FAVORITES}
          />
        ),
      });
    }

    return tabsList;
  }, [
    searchQuery.isPending,
    subjectIdObject.subjectLMA,
    subjectIdObject.subjectDA,
    subjectIdObject.subjectSA,
    t,
    ndlaId,
    favoriteSubjects,
  ]);

  if (!tabs.length || userDataPending) return null;

  return (
    <TabsRoot
      variant="outline"
      defaultValue={tabs[0].id}
      translations={{
        listLabel: t("welcomePage.listLabels.articleStatuses"),
      }}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={`trigger-${tab.id}`} value={tab.id}>
            {tab.title}
          </TabsTrigger>
        ))}
        <TabsIndicator />
      </TabsList>
      {tabs.map((tab) => (
        <WelcomePageTabsContent value={tab.id} key={tab.id}>
          {tab.content}
        </WelcomePageTabsContent>
      ))}
    </TabsRoot>
  );
};

export default ArticleStatuses;
