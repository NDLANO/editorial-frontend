/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from "react-router-dom";
import { Heading, PageContainer } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { LearningpathMenu } from "./LearningpathMenu";
import { LearningStepPreview } from "./LearningStepPreview";
import { LearningpathFormHeader } from "../components/LearningpathFormHeader";
import { LearningpathFormStepper } from "../components/LearningpathFormStepper";

interface Props {
  learningpath: ILearningPathV2DTO;
  language: string;
}

const StyledPageContainer = styled(PageContainer, {
  base: {
    position: "relative",
    minHeight: "100vh",
    gap: "large",
  },
  variants: {
    rounded: {
      true: {
        borderRadius: "xsmall",
      },
    },
  },
});

export const LearningpathPreview = ({ learningpath, language }: Props) => {
  const { stepId } = useParams<"stepId">();

  const currentStep = stepId
    ? learningpath.learningsteps.find((step) => step.id === parseInt(stepId))
    : learningpath.learningsteps[0];

  return (
    <StyledPageContainer padding="none">
      <LearningpathFormHeader learningpath={learningpath} language={language} />
      <LearningpathFormStepper id={learningpath.id} language={language} currentStep="preview" />
      <Heading>Forhåndsvis</Heading>
      <LearningpathMenu learningpath={learningpath} language={language} />
      {!!currentStep && <LearningStepPreview step={currentStep} learningpath={learningpath} language={language} />}
    </StyledPageContainer>
  );
};
