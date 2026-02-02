/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  STORED_PAGE_SIZE_SUBJECT_VIEW_DA,
  STORED_PAGE_SIZE_SUBJECT_VIEW_FAVORITES,
  STORED_PAGE_SIZE_SUBJECT_VIEW_LMA,
  STORED_PAGE_SIZE_SUBJECT_VIEW_SA,
} from "../../../constants";
import { SubjectIdObject } from "../utils";
import SubjectViewContent from "./SubjectViewContent";
import { WelcomePageTabsContent } from "./WelcomePageTabsContent";

interface Props {
  favoriteSubjects: string[] | undefined;
  userDataPending: boolean;
  subjectIdObject: SubjectIdObject;
  isPending: boolean;
}

const SubjectView = ({ favoriteSubjects, userDataPending, subjectIdObject, isPending }: Props) => {
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    if (isPending) return [];

    const tabsList = [];

    if (subjectIdObject.subjectLMA.length) {
      tabsList.push({
        title: t("welcomePage.lmaSubjects"),
        id: "lma-subject-view",
        content: (
          <SubjectViewContent
            subjects={subjectIdObject.subjectLMA}
            isFavoriteTab={false}
            title={t("welcomePage.subjectView.lma")}
            tabTitle={t("welcomePage.lmaSubjects")}
            description={t("welcomePage.subjectView.description")}
            localStoragePageSizeKey={STORED_PAGE_SIZE_SUBJECT_VIEW_LMA}
          />
        ),
      });
    }

    if (subjectIdObject.subjectDA.length) {
      tabsList.push({
        title: t("welcomePage.daSubjects"),
        id: "da-subject-view",
        content: (
          <SubjectViewContent
            subjects={subjectIdObject.subjectDA}
            isFavoriteTab={false}
            title={t("welcomePage.subjectView.da")}
            tabTitle={t("welcomePage.daSubjects")}
            description={t("welcomePage.subjectView.description")}
            localStoragePageSizeKey={STORED_PAGE_SIZE_SUBJECT_VIEW_DA}
          />
        ),
      });
    }

    if (subjectIdObject.subjectSA.length) {
      tabsList.push({
        title: t("welcomePage.saSubjects"),
        id: "sa-subject-view",
        content: (
          <SubjectViewContent
            subjects={subjectIdObject.subjectSA}
            isFavoriteTab={false}
            title={t("welcomePage.subjectView.sa")}
            tabTitle={t("welcomePage.saSubjects")}
            description={t("welcomePage.subjectView.description")}
            localStoragePageSizeKey={STORED_PAGE_SIZE_SUBJECT_VIEW_SA}
          />
        ),
      });
    }

    if (favoriteSubjects?.length) {
      tabsList.push({
        title: t("welcomePage.favoriteSubjects"),
        id: "favorite-subject-view",
        content: (
          <SubjectViewContent
            subjects={favoriteSubjects}
            isFavoriteTab={true}
            title={t("welcomePage.subjectView.favorites")}
            tabTitle={t("welcomePage.favoriteSubjects")}
            description={t("welcomePage.subjectView.description")}
            localStoragePageSizeKey={STORED_PAGE_SIZE_SUBJECT_VIEW_FAVORITES}
          />
        ),
      });
    }
    return tabsList;
  }, [
    favoriteSubjects,
    isPending,
    subjectIdObject.subjectDA,
    subjectIdObject.subjectLMA,
    subjectIdObject.subjectSA,
    t,
  ]);

  if (!tabs.length || userDataPending) return null;

  return (
    <TabsRoot
      translations={{
        listLabel: t("welcomePage.listLabels.subjectView"),
      }}
      variant="outline"
      defaultValue={tabs[0].id}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.title}
          </TabsTrigger>
        ))}
        <TabsIndicator />
      </TabsList>
      {tabs.map((tab) => (
        <WelcomePageTabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </WelcomePageTabsContent>
      ))}
    </TabsRoot>
  );
};
export default SubjectView;
