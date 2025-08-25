/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { Heading, PageContainer, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleStep } from "./ArticleStep";
import { EmbedStep } from "./EmbedStep";
import { ExternalStep } from "./ExternalStep";
import { LearningpathMenu } from "./LearningpathMenu";
import { StepTitle } from "./StepTitle";
import { TextStep } from "./TextStep";
import { FormContent } from "../../components/FormikForm";
import { PageSpinner } from "../../components/PageSpinner";
import { useLearningpath } from "../../modules/learningpath/learningpathQueries";
import { isNotFoundError } from "../../util/resolveJsonOrRejectWithError";
import { routes } from "../../util/routeHelpers";
import { LearningpathErrorMessage } from "../LearningpathPage/components/LearningpathErrorMessage";
import { getFormTypeFromStep } from "../LearningpathPage/learningpathUtils";
import NotFound from "../NotFoundPage/NotFoundPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const StepWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

export const Component = () => {
  return <PrivateRoute component={<LearningpathPreviewPage />} />;
};

const LearningpathPreviewPage = () => {
  const { t } = useTranslation();
  const { id, language, stepId } = useParams<"stepId" | "id" | "language">();

  const numericId = parseInt(id ?? "");
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

  if (!learningpathQuery.data.supportedLanguages.includes(language)) {
    return (
      <Navigate
        replace
        to={routes.learningpath.preview(
          learningpathQuery.data.id,
          learningpathQuery.data.supportedLanguages[0],
          stepId,
        )}
      />
    );
  }

  const learningpath = learningpathQuery.data;

  const currentStep = stepId
    ? learningpath.learningsteps.find((step) => step.id === parseInt(stepId))
    : learningpath.learningsteps[0];

  const stepType = currentStep ? getFormTypeFromStep(currentStep) : null;

  return (
    <PageContainer>
      <title>{t("htmlTitles.learningpath.preview")}</title>
      <FormContent>
        <Heading>{t("learningpathForm.preview.heading")}</Heading>
        <StepWrapper>
          {currentStep && stepType ? (
            <>
              <LearningpathMenu learningpath={learningpath} language={language} step={currentStep} />
              {stepType !== "text" && <StepTitle step={currentStep} />}
              {stepType === "text" ? (
                <TextStep step={currentStep} learningpath={learningpath} />
              ) : stepType === "resource" ? (
                <ArticleStep step={currentStep} language={language} />
              ) : stepType === "external" && currentStep.embedUrl?.embedType === "external" ? (
                <ExternalStep step={currentStep} learningpath={learningpath} />
              ) : stepType === "external" ? (
                <EmbedStep step={currentStep} />
              ) : null}
            </>
          ) : (
            <Text>{t("learningpathForm.preview.noSteps")}</Text>
          )}
        </StepWrapper>
      </FormContent>
    </PageContainer>
  );
};
