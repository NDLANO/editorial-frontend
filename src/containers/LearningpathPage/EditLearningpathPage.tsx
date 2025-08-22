/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { PageContainer, PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LearningpathErrorMessage } from "./components/LearningpathErrorMessage";
import { LearningpathForm } from "./LearningpathForm";
import { PageSpinner } from "../../components/PageSpinner";
import { useLearningpath } from "../../modules/learningpath/learningpathQueries";
import { isNotFoundError } from "../../util/resolveJsonOrRejectWithError";
import { CreatingLanguageLocationState, routes } from "../../util/routeHelpers";
import NotFound from "../NotFoundPage/NotFoundPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

export const Component = () => {
  return <PrivateRoute component={<EditLearningpathPage />} />;
};

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const EditLearningpathPage = () => {
  const { id, language } = useParams<"id" | "language">();
  const { t } = useTranslation();

  const numericId = parseInt(id ?? "");
  const learningpathQuery = useLearningpath({ id: numericId, language }, { enabled: !!numericId });
  const location = useLocation();

  if (!numericId || !language) {
    return <NotFound />;
  }

  if (learningpathQuery.isLoading) {
    return <PageSpinner />;
  }

  if (learningpathQuery.isError && isNotFoundError(learningpathQuery.error)) {
    return <NotFound />;
  }

  if (learningpathQuery.isError || !learningpathQuery.data) {
    return (
      <PageContainer>
        <LearningpathErrorMessage />
      </PageContainer>
    );
  }

  if (
    !learningpathQuery.data.supportedLanguages.includes(language) &&
    !(location.state as CreatingLanguageLocationState | undefined)?.isCreatingLanguage
  ) {
    return (
      <Navigate
        replace
        to={routes.learningpath.edit(learningpathQuery.data.id, learningpathQuery.data.supportedLanguages[0])}
      />
    );
  }

  return (
    <PageContent>
      <Container>
        <title>{t("htmlTitles.learningpath.edit")}</title>
        <LearningpathForm learningpath={learningpathQuery.data} language={language} />
      </Container>
    </PageContent>
  );
};
