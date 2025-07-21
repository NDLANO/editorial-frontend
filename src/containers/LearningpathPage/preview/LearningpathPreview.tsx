/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Heading, PageContainer, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { ArticleStep } from "./ArticleStep";
import { EmbedStep } from "./EmbedStep";
import { ExternalStep } from "./ExternalStep";
import { LearningpathMenu } from "./LearningpathMenu";
import { StepTitle } from "./StepTitle";
import { LearningpathFormHeader } from "../components/LearningpathFormHeader";
import { LearningpathFormStepper } from "../components/LearningpathFormStepper";
import { getFormTypeFromStep } from "../learningpathUtils";
import { TextStep } from "./TextStep";

interface Props {
  learningpath: ILearningPathV2DTO;
  language: string;
}

const StyledPageContainer = styled(PageContainer, {
  base: {
    position: "relative",
    minHeight: "100vh",
    gap: "medium",
  },
  variants: {
    rounded: {
      true: {
        borderRadius: "xsmall",
      },
    },
  },
});

const StepWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

export const LearningpathPreview = ({ learningpath, language }: Props) => {
  const { t } = useTranslation();
  const { stepId } = useParams<"stepId">();

  const currentStep = stepId
    ? learningpath.learningsteps.find((step) => step.id === parseInt(stepId))
    : learningpath.learningsteps[0];

  const stepType = currentStep ? getFormTypeFromStep(currentStep) : null;

  return (
    <StyledPageContainer padding="none">
      <LearningpathFormHeader learningpath={learningpath} language={language} />
      <LearningpathFormStepper id={learningpath.id} language={language} currentStep="preview" />
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
    </StyledPageContainer>
  );
};
