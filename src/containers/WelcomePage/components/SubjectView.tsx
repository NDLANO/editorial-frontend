/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { mq, breakpoints } from "@ndla/core";
import { Tabs } from "@ndla/tabs";
import SubjectViewContent from "./SubjectViewContent";
import { GRID_GAP } from "../../../components/Layout/Layout";
import {
  STORED_PAGE_SIZE_SUBJECT_VIEW_DA,
  STORED_PAGE_SIZE_SUBJECT_VIEW_FAVORITES,
  STORED_PAGE_SIZE_SUBJECT_VIEW_LMA,
  STORED_PAGE_SIZE_SUBJECT_VIEW_SA,
} from "../../../constants";
import { SubjectIdObject } from "../utils";

const StyledWrapper = styled.div`
  ${mq.range({ from: breakpoints.tabletWide })} {
    margin-top: ${GRID_GAP};
  }
`;

interface Props {
  favoriteSubjects: string[] | undefined;
  userDataLoading: boolean;
  subjectIdObject: SubjectIdObject;
  isLoading: boolean;
}

const SubjectView = ({ favoriteSubjects, userDataLoading, subjectIdObject, isLoading }: Props) => {
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    if (isLoading) return [];

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
            description={t("welcomePage.subjectView.description")}
            localStoragePageSizeKey={STORED_PAGE_SIZE_SUBJECT_VIEW_FAVORITES}
          />
        ),
      });
    }
    return tabsList;
  }, [
    favoriteSubjects,
    isLoading,
    subjectIdObject.subjectDA,
    subjectIdObject.subjectLMA,
    subjectIdObject.subjectSA,
    t,
  ]);

  if (!tabs.length || userDataLoading) return null;

  return (
    <StyledWrapper>
      <Tabs variant="rounded" tabs={tabs} />
    </StyledWrapper>
  );
};
export default SubjectView;
