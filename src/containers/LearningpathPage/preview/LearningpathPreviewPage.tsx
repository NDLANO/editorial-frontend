/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageContainer } from "@ndla/primitives";
import { LearningpathPreview } from "./LearningpathPreview";
import { PageSpinner } from "../../../components/PageSpinner";
import { useLearningpath } from "../../../modules/learningpath/learningpathQueries";
import { isNotFoundError } from "../../../util/resolveJsonOrRejectWithError";
import NotFound from "../../NotFoundPage/NotFoundPage";
import { LearningpathErrorMessage } from "../components/LearningpathErrorMessage";

export const LearningpathPreviewPage = () => {
  const { t } = useTranslation();
  const { id = "", language } = useParams<"id" | "language">();
  const numericId = parseInt(id);
  const learningpathQuery = useLearningpath({ id: numericId, language }, { enabled: !!numericId });

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

  return (
    <>
      <title>{t("htmlTitles.learningpathForm.preview")}</title>
      <LearningpathPreview learningpath={learningpathQuery.data} language={language} />
    </>
  );
};
