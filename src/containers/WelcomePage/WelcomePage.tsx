/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { breakpoints, spacing } from "@ndla/core";
import { HelmetWithTracker } from "@ndla/tracker";
import ArticleStatuses from "./components/ArticleStatuses";
import LastUsedItems from "./components/LastUsedItems";
import Revisions from "./components/Revisions";
import SubjectView from "./components/SubjectView";
import WelcomeHeader from "./components/WelcomeHeader";
import WorkList from "./components/worklist/WorkList";
import { SubjectIdObject, customFieldsBody, defaultSubjectIdObject, getResultSubjectIdObject } from "./utils";
import { GridContainer, Column } from "../../components/Layout/Layout";
import { useUserData } from "../../modules/draft/draftQueries";
import { usePostSearchNodesMutation } from "../../modules/nodes/nodeMutations";
import { getAccessToken, getAccessTokenPersonal } from "../../util/authHelpers";
import { isValid } from "../../util/jwtHelper";
import Footer from "../App/components/FooterWrapper";
import { useSession } from "../Session/SessionProvider";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${spacing.small};
  margin-top: ${spacing.small};
  flex: 1;
`;

export const WelcomePage = () => {
  const { taxonomyVersion } = useTaxonomyVersion();
  const { ndlaId } = useSession();
  const { mutateAsync: postSearchNodes, isPending } = usePostSearchNodesMutation();
  const [subjectIdObject, setSubjectIdObject] = useState<SubjectIdObject>(defaultSubjectIdObject);

  useEffect(() => {
    if (!ndlaId) return;
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

  const { t } = useTranslation();

  const { data, isLoading } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });

  const lastUsedResources = useMemo(
    () => data?.latestEditedArticles?.map((a) => Number(a)) ?? [],
    [data?.latestEditedArticles],
  );
  localStorage.setItem("lastPath", "");

  return (
    <Wrapper>
      <GridContainer breakpoint={breakpoints.desktop}>
        <HelmetWithTracker title={t("htmlTitles.welcomePage")} />
        <Column>
          <WelcomeHeader />
        </Column>
        <Column>{ndlaId && <WorkList ndlaId={ndlaId} />}</Column>
        <Column colEnd={6}>
          {ndlaId && (
            <>
              <LastUsedItems lastUsedResources={lastUsedResources} lastUsedConcepts={data?.latestEditedConcepts} />
              <ArticleStatuses
                ndlaId={ndlaId}
                favoriteSubjects={data?.favoriteSubjects}
                userDataLoading={isLoading}
                subjectIdObject={subjectIdObject}
                isPending={isPending}
              />
            </>
          )}
        </Column>
        <Column colStart={6}>
          {ndlaId && (
            <>
              <Revisions userData={data} />
              <SubjectView
                userDataLoading={isLoading}
                favoriteSubjects={data?.favoriteSubjects}
                subjectIdObject={subjectIdObject}
                isPending={isPending}
              />
            </>
          )}
        </Column>
      </GridContainer>
      <Footer showLocaleSelector />
    </Wrapper>
  );
};

export default WelcomePage;
