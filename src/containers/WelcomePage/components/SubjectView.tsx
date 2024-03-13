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
  STORED_SORT_OPTION_SUBJECT_VIEW_DA,
  STORED_SORT_OPTION_SUBJECT_VIEW_FAVORITES,
  STORED_SORT_OPTION_SUBJECT_VIEW_LMA,
  STORED_SORT_OPTION_SUBJECT_VIEW_SA,
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
  isPending: boolean;
}

const SubjectView = ({ favoriteSubjects, userDataLoading, subjectIdObject, isPending }: Props) => {
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    if (!isPending) {
      return [
        ...(subjectIdObject.subjectLMA.length
          ? [
              {
                title: t("welcomePage.lmaSubjects"),
                id: "lma-subject-view",
                content: (
                  <SubjectViewContent
                    subjectIds={subjectIdObject.subjectLMA}
                    title={t("welcomePage.lmaSubjectView")}
                    description={t("welcomePage.subjectViewDescription")}
                    localStorageSortKey={STORED_SORT_OPTION_SUBJECT_VIEW_LMA}
                    localStoragePageSizeKey={STORED_PAGE_SIZE_SUBJECT_VIEW_LMA}
                  />
                ),
              },
            ]
          : []),
        ...(subjectIdObject.subjectDA.length
          ? [
              {
                title: t("welcomePage.daSubjects"),
                id: "da-subject-view",
                content: (
                  <SubjectViewContent
                    subjectIds={subjectIdObject.subjectDA}
                    title={t("welcomePage.daSubjectView")}
                    description={t("welcomePage.subjectViewDescription")}
                    localStorageSortKey={STORED_SORT_OPTION_SUBJECT_VIEW_DA}
                    localStoragePageSizeKey={STORED_PAGE_SIZE_SUBJECT_VIEW_DA}
                  />
                ),
              },
            ]
          : []),
        ...(subjectIdObject.subjectSA.length
          ? [
              {
                title: t("welcomePage.saSubjects"),
                id: "sa-subject-view",
                content: (
                  <SubjectViewContent
                    subjectIds={subjectIdObject.subjectSA}
                    title={t("welcomePage.saSubjectView")}
                    description={t("welcomePage.subjectViewDescription")}
                    localStorageSortKey={STORED_SORT_OPTION_SUBJECT_VIEW_SA}
                    localStoragePageSizeKey={STORED_PAGE_SIZE_SUBJECT_VIEW_SA}
                  />
                ),
              },
            ]
          : []),
        ...(favoriteSubjects?.length
          ? [
              {
                title: t("welcomePage.favoriteSubjects"),
                id: "favorite-subject-view",
                content: (
                  <SubjectViewContent
                    subjectIds={favoriteSubjects}
                    title={t("welcomePage.favoritesSubjectView")}
                    description={t("welcomePage.subjectViewDescription")}
                    localStorageSortKey={STORED_SORT_OPTION_SUBJECT_VIEW_FAVORITES}
                    localStoragePageSizeKey={STORED_PAGE_SIZE_SUBJECT_VIEW_FAVORITES}
                  />
                ),
              },
            ]
          : []),
      ];
    }
    return [];
  }, [
    favoriteSubjects,
    isPending,
    subjectIdObject.subjectDA,
    subjectIdObject.subjectLMA,
    subjectIdObject.subjectSA,
    t,
  ]);

  return (
    <>
      {!!tabs.length && !userDataLoading && (
        <StyledWrapper>
          <Tabs variant="rounded" tabs={tabs} />
        </StyledWrapper>
      )}
    </>
  );
};
export default SubjectView;
