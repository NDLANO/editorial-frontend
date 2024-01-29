/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import Tabs from "@ndla/tabs";
import ArticleStatusContent from "./ArticleStatusContent";
import { GRID_GAP } from "../../../components/Layout/Layout";
import { FAVOURITES_SUBJECT_ID, LMA_SUBJECT_ID, LANGUAGE_SUBJECT_ID, DESK_SUBJECT_ID } from "../../../constants";
import { usePostSearchNodesMutation } from "../../../modules/nodes/nodeMutations";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { SubjectIdObject, customFieldsBody, defaultSubjectIdObject, getResultSubjectIdObject } from "../utils";

const StyledWrapper = styled.div`
  margin-top: ${GRID_GAP};
`;

interface Props {
  ndlaId: string;
  favoriteSubjects: string[] | undefined;
  userDataLoading: boolean;
}

const ArticleStatuses = ({ ndlaId, favoriteSubjects, userDataLoading }: Props) => {
  const [subjectIdObject, setSubjectIdObject] = useState<SubjectIdObject>(defaultSubjectIdObject);
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: postSearchNodes, isPending } = usePostSearchNodesMutation();

  useEffect(() => {
    const updateSubjectIds = async () => {
      const nodesSearchResult = await postSearchNodes({
        body: customFieldsBody(ndlaId),
        taxonomyVersion,
      });
      const resultSubjectIdObject = getResultSubjectIdObject(ndlaId, nodesSearchResult.results);

      setSubjectIdObject(resultSubjectIdObject);
    };
    updateSubjectIds();
  }, [ndlaId, postSearchNodes, taxonomyVersion]);

  const tabs = useMemo(() => {
    if (!isPending) {
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
                  />
                ),
              },
            ]
          : []),
        ...(subjectIdObject.subjectDeskResponsible.length
          ? [
              {
                title: t("welcomePage.deskSubjects"),
                id: "desk-subjects",
                content: (
                  <ArticleStatusContent
                    ndlaId={ndlaId}
                    subjectIds={subjectIdObject.subjectDeskResponsible}
                    title={t("welcomePage.deskSubjectsHeading")}
                    description={t("welcomePage.deskSubjectsDescription")}
                    searchPageSubjectFilter={DESK_SUBJECT_ID}
                  />
                ),
              },
            ]
          : []),
        ...(subjectIdObject.subjectLanguageResponsible.length
          ? [
              {
                title: t("welcomePage.languageSubjects"),
                id: "langauge-subjects",
                content: (
                  <ArticleStatusContent
                    ndlaId={ndlaId}
                    subjectIds={subjectIdObject.subjectLanguageResponsible}
                    title={t("welcomePage.languageSubjectsHeading")}
                    description={t("welcomePage.languageSubjectsDescription")}
                    searchPageSubjectFilter={LANGUAGE_SUBJECT_ID}
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
                  />
                ),
              },
            ]
          : []),
      ];
    }
    return [];
  }, [isPending, subjectIdObject, t, ndlaId, favoriteSubjects]);

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
