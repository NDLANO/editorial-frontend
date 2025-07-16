/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ILearningPathV2DTO, ILearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { getFormTypeFromStep } from "../learningpathUtils";
import { ArticleStep } from "./ArticleStep";
import { ExternalStep } from "./ExternalStep";
import { TextStep } from "./TextStep";

interface Props {
  learningpath: ILearningPathV2DTO;
  step: ILearningStepV2DTO;
  language: string;
}

export const LearningStepPreview = ({ step, learningpath, language }: Props) => {
  const type = getFormTypeFromStep(step);
  // TODO: skip id

  if (type === "text") {
    return <TextStep learningpathStep={step} learningpath={learningpath} skipToContentId={undefined} />;
  }

  if (type === "resource") {
    return <ArticleStep learningpathStep={step} language={language} />;
  }

  if (type === "external") {
    return <ExternalStep learningpathStep={step} learningpath={learningpath} />;
  }

  return null;
};
