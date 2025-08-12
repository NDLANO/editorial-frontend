/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Heading, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useLearningpathContext } from "../LearningpathLayout";
import { getFormTypeFromStep } from "../learningpathUtils";
import { ArticleStep } from "./ArticleStep";
import { EmbedStep } from "./EmbedStep";
import { ExternalStep } from "./ExternalStep";
import { LearningpathMenu } from "./LearningpathMenu";
import { StepTitle } from "./StepTitle";
import { TextStep } from "./TextStep";
import { FormContent } from "../../../components/FormikForm";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";

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

export const LearningpathPreviewPage = () => {
  const { t } = useTranslation();
  const { learningpath, language } = useLearningpathContext();
  const { stepId } = useParams<"stepId">();

  const currentStep = stepId
    ? learningpath.learningsteps.find((step) => step.id === parseInt(stepId))
    : learningpath.learningsteps[0];

  const stepType = currentStep ? getFormTypeFromStep(currentStep) : null;

  return (
    <>
      <title>{t("htmlTitles.learningpathForm.preview")}</title>
      <FormContent>
        <Heading asChild consumeCss>
          <h2>{t("learningpathForm.preview.heading")}</h2>
        </Heading>
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
    </>
  );
};
