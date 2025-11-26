/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import ArticleStatuses from "./components/ArticleStatuses";
import LastUsedItems from "./components/LastUsedItems";
import Revisions from "./components/Revisions";
import SubjectView from "./components/SubjectView";
import WelcomeHeader from "./components/WelcomeHeader";
import WorkList from "./components/worklist/WorkList";
import { customFieldsBody, defaultSubjectIdObject, getResultSubjectIdObject } from "./utils";
import { useUserData } from "../../modules/draft/draftQueries";
import { usePostSearchNodes } from "../../modules/nodes/nodeQueries";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";
import { useSession } from "../Session/SessionProvider";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

const StyledPageContent = styled(PageContent, {
  base: {
    marginBlockStart: "xsmall",
    gap: "medium",
  },
});

const GridWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
    flexDirection: "column",
    desktop: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(400px, 1fr))",
    },
  },
});

const GridColumn = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

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
    enabled: isActiveToken(getAccessToken()),
  });

  const lastUsedResources = useMemo(
    () => data?.latestEditedArticles?.map((a) => Number(a)) ?? [],
    [data?.latestEditedArticles],
  );

  const lastUsedConcepts = useMemo(
    () => data?.latestEditedConcepts?.map((a) => Number(a)) ?? [],
    [data?.latestEditedConcepts],
  );

  const lastUsedLearningpaths = useMemo(
    () => data?.latestEditedLearningpaths?.map((a) => Number(a)) ?? [],
    [data?.latestEditedLearningpaths],
  );

  return (
    <StyledPageContent variant="wide">
      <title>{t("htmlTitles.welcomePage")}</title>
      <WelcomeHeader />
      {!!ndlaId && (
        <GridWrapper>
          <WorkList ndlaId={ndlaId} />
          <GridColumn>
            <LastUsedItems
              lastUsedResources={lastUsedResources}
              lastUsedConcepts={lastUsedConcepts}
              lastUsedLearningpaths={lastUsedLearningpaths}
            />
            <ArticleStatuses
              ndlaId={ndlaId}
              favoriteSubjects={data?.favoriteSubjects}
              userDataPending={isPending}
              subjectIdObject={subjectIdObject}
            />
          </GridColumn>
          <GridColumn>
            <Revisions userData={data} subjectIdObject={subjectIdObject} isPending={searchQuery.isPending} />
            <SubjectView
              userDataPending={isPending}
              favoriteSubjects={data?.favoriteSubjects}
              subjectIdObject={subjectIdObject}
              isPending={searchQuery.isPending}
            />
          </GridColumn>
        </GridWrapper>
      )}
    </StyledPageContent>
  );
};

export const Component = WelcomePage;
