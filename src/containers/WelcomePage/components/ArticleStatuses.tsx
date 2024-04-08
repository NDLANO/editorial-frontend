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
import { Tabs } from "@ndla/tabs";
import ArticleStatusContent from "./ArticleStatusContent";
import { GRID_GAP } from "../../../components/Layout/Layout";
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

const StyledWrapper = styled.div`
  margin-top: ${GRID_GAP};
`;

interface Props {
  ndlaId: string;
  favoriteSubjects: string[] | undefined;
  userDataLoading: boolean;
  subjectIdObject: SubjectIdObject;
}

const ArticleStatuses = ({ ndlaId, favoriteSubjects, userDataLoading, subjectIdObject }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const searchQuery = usePostSearchNodes({ ...customFieldsBody(ndlaId), taxonomyVersion });

  const tabs = useMemo(() => {
    if (!searchQuery.isLoading) {
      return [
        ...(subjectIdObject.subjectLMA.length
          ? [
              {
                title: t("welcomePage.lmaSubjects"),
                id: "lma-subjects",
                content: (
                  <ArticleStatusContent
                    ndlaId={ndlaId}
                    subjectIds={subjectIdObject.subjectLMA}
                    title={t("welcomePage.lmaSubjectsHeading")}
                    description={t("welcomePage.lmaSubjectsDescription")}
                    searchPageSubjectFilter={LMA_SUBJECT_ID}
                    localStorageKey={STORED_FILTER_LMA_SUBJECT}
                    onHoldLocalStorageKey={STORED_ON_HOLD_LMA_SUBJECT}
                  />
                ),
              },
            ]
          : []),
        ...(subjectIdObject.subjectDA.length
          ? [
              {
                title: t("welcomePage.daSubjects"),
                id: "desk-subjects",
                content: (
                  <ArticleStatusContent
                    ndlaId={ndlaId}
                    subjectIds={subjectIdObject.subjectDA}
                    title={t("welcomePage.daSubjectsHeading")}
                    description={t("welcomePage.daSubjectsDescription")}
                    searchPageSubjectFilter={DA_SUBJECT_ID}
                    localStorageKey={STORED_FILTER_DA_SUBJECT}
                    onHoldLocalStorageKey={STORED_ON_HOLD_DA_SUBJECT}
                  />
                ),
              },
            ]
          : []),
        ...(subjectIdObject.subjectSA.length
          ? [
              {
                title: t("welcomePage.saSubjects"),
                id: "langauge-subjects",
                content: (
                  <ArticleStatusContent
                    ndlaId={ndlaId}
                    subjectIds={subjectIdObject.subjectSA}
                    title={t("welcomePage.saSubjectsHeading")}
                    description={t("welcomePage.saSubjectsDescription")}
                    searchPageSubjectFilter={SA_SUBJECT_ID}
                    localStorageKey={STORED_FILTER_SA_SUBJECT}
                    onHoldLocalStorageKey={STORED_ON_HOLD_SA_SUBJECT}
                  />
                ),
              },
            ]
          : []),
        ...(favoriteSubjects?.length
          ? [
              {
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
              },
            ]
          : []),
      ];
    }
    return [];
  }, [
    searchQuery.isLoading,
    subjectIdObject.subjectLMA,
    subjectIdObject.subjectDA,
    subjectIdObject.subjectSA,
    t,
    ndlaId,
    favoriteSubjects,
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

export default ArticleStatuses;
