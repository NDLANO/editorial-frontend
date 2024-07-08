/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
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
import { customFieldsBody, defaultSubjectIdObject, getResultSubjectIdObject } from "./utils";
import { GridContainer, Column } from "../../components/Layout/Layout";
import { useUserData } from "../../modules/draft/draftQueries";
import { usePostSearchNodes } from "../../modules/nodes/nodeQueries";
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
  const searchQuery = usePostSearchNodes(
    {
      ...customFieldsBody(ndlaId ?? ""),
      taxonomyVersion,
    },
    { enabled: !!ndlaId },
  );

  const subjectIdObject = useMemo(() => {
    if (!searchQuery.data) return defaultSubjectIdObject;
    return getResultSubjectIdObject(ndlaId, searchQuery.data.results);
  }, [ndlaId, searchQuery.data]);

  const { t } = useTranslation();

  const { data, isPending } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });

  const lastUsedResources = useMemo(
    () => data?.latestEditedArticles?.map((a) => Number(a)) ?? [],
    [data?.latestEditedArticles],
  );

  const lastUsedConcepts = useMemo(
    () => data?.latestEditedConcepts?.map((a) => Number(a)) ?? [],
    [data?.latestEditedConcepts],
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
              <LastUsedItems lastUsedResources={lastUsedResources} lastUsedConcepts={lastUsedConcepts} />
              <ArticleStatuses
                ndlaId={ndlaId}
                favoriteSubjects={data?.favoriteSubjects}
                userDataPending={isPending}
                subjectIdObject={subjectIdObject}
              />
            </>
          )}
        </Column>
        <Column colStart={6}>
          {ndlaId && (
            <>
              <Revisions userData={data} />
              <SubjectView
                userDataPending={isPending}
                favoriteSubjects={data?.favoriteSubjects}
                subjectIdObject={subjectIdObject}
                isPending={searchQuery.isPending}
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
