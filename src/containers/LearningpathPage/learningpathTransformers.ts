/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { LearningpathFormValues } from "./learningpathInterfaces";
import { plainTextToEditorValue } from "../../util/articleContentConverter";

export const learningpathApiTypeToFormType = (
  learningpath: ILearningPathV2DTO | undefined,
  language: string,
): LearningpathFormValues => {
  return {
    id: learningpath?.id,
    title: plainTextToEditorValue(learningpath?.title.title ?? ""),
    description: plainTextToEditorValue(learningpath?.description.description ?? ""),
    language: language,
    supportedLanguages: learningpath?.supportedLanguages ?? [language],
  };
};
