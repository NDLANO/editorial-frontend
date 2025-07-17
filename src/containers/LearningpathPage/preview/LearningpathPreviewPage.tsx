/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { LearningpathPreview } from "./LearningpathPreview";
import { PageSpinner } from "../../../components/PageSpinner";
import { useLearningpath } from "../../../modules/learningpath/learningpathQueries";
import NotFound from "../../NotFoundPage/NotFoundPage";

export const LearningpathPreviewPage = () => {
  const { t } = useTranslation();
  const { id = "", language } = useParams<"id" | "language">();
  const learningpathQuery = useLearningpath({ id: parseInt(id), language }, { enabled: !!parseInt(id) });
  if (!parseInt(id) || !language) {
    return <NotFound />;
  }

  if (learningpathQuery.isPending) {
    return <PageSpinner />;
  }

  if (learningpathQuery.isError) {
    // TODO: Should probably be an error. Should also account for NotFound
    return <NotFound />;
  }

  return (
    <>
      <title>{t("htmlTitles.learningpathForm.preview")}</title>
      <LearningpathPreview learningpath={learningpathQuery.data} language={language} />
    </>
  );
};
