/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button, Heading, PageContent, Text } from "@ndla/primitives";
import { FormActionsContainer, FormContent } from "../../../components/FormikForm";
import { PageSpinner } from "../../../components/PageSpinner";
import { PUBLISHED } from "../../../constants";
import { usePutLearningpathStatusMutation } from "../../../modules/learningpath/learningpathMutations";
import { useLearningpath } from "../../../modules/learningpath/learningpathQueries";
import NotFound from "../../NotFoundPage/NotFoundPage";
import { LearningpathFormHeader } from "../components/LearningpathFormHeader";
import { LearningpathFormStepper } from "../components/LearningpathFormStepper";

export const LearningpathStatusPage = () => {
  const { t } = useTranslation();
  const { id, language } = useParams<"id" | "language">();
  const numericId = parseInt(id || "");
  const learningpathQuery = useLearningpath({ id: numericId, language }, { enabled: !!numericId });
  const putLearningpathStatusMutation = usePutLearningpathStatusMutation();

  if (!numericId || !language) {
    return <NotFound />;
  }

  if (learningpathQuery.isPending) {
    return <PageSpinner />;
  }

  const isPublished = learningpathQuery.data?.status === PUBLISHED;

  return (
    <PageContent>
      <title>{t("htmlTitles.learningpathForm.status")}</title>
      <FormContent>
        <LearningpathFormHeader learningpath={learningpathQuery.data} language={language} />
        <LearningpathFormStepper id={numericId} language={language} currentStep="status" />
        <Heading>{t("learningpathForm.status.heading")}</Heading>
        <Text>{t(`learningpathForm.status.${isPublished ? "publishedText" : "unpublishedText"}`)}</Text>
        <FormActionsContainer>
          <Button
            disabled={learningpathQuery.data?.status === PUBLISHED}
            loading={putLearningpathStatusMutation.isPending}
            onClick={() => putLearningpathStatusMutation.mutate({ learningpathId: numericId, status: PUBLISHED })}
          >
            {t("learningpathForm.status.publish")}
          </Button>
        </FormActionsContainer>
      </FormContent>
    </PageContent>
  );
};
