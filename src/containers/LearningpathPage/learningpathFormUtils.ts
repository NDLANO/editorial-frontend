/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ILearningPathV2DTO,
  INewLearningPathV2DTO,
  IUpdatedLearningPathV2DTO,
} from "@ndla/types-backend/learningpath-api";

export interface LearningpathFormValues {
  id: number | undefined;
  title: string;
  description: string;
  coverPhotoMetaUrl?: string;
  tags: string[];
  language: string | undefined;
  grepCodes: string[];
  supportedLanguages: string[];
  // This field is only used for error checking in revisions
  responsibleId?: string;
  revisionError?: string;
  status:
    | {
        current: string;
      }
    | undefined;
  priority?: ILearningPathV2DTO["priority"];
  revisionMeta: {
    note: string;
    revisionDate: string;
    status: string;
    new?: boolean;
  }[];
}

export const learningpathApiTypeToFormType = (
  learningpath: ILearningPathV2DTO | undefined,
  ndlaId: string | undefined,
): LearningpathFormValues => {
  return {
    id: learningpath?.id,
    language: learningpath?.title.language,
    supportedLanguages: learningpath?.supportedLanguages ?? [],
    title: learningpath?.title.title ?? "",
    grepCodes: learningpath?.grepCodes ?? [],
    description: learningpath?.description.description ?? "",
    coverPhotoMetaUrl: learningpath?.coverPhoto?.metaUrl,
    tags: learningpath?.tags.tags ?? [],
    revisionMeta: learningpath?.revisions ?? [],
    responsibleId: learningpath ? learningpath.responsible?.responsibleId : ndlaId,
    priority: learningpath?.priority ?? "unspecified",
    status: learningpath?.status
      ? {
          current: learningpath.status,
        }
      : undefined,
  };
};

export const learningpathFormTypeToNewApiType = (
  values: LearningpathFormValues,
  language: string,
): INewLearningPathV2DTO => {
  return {
    language,
    title: values.title,
    description: values.description,
    coverPhotoMetaUrl: values.coverPhotoMetaUrl,
    tags: values.tags,
    responsibleId: values.responsibleId,
    grepCodes: values.grepCodes,
  };
};

export const learningpathFormTypeToApiType = (
  learningpath: ILearningPathV2DTO,
  values: LearningpathFormValues,
  language: string,
): IUpdatedLearningPathV2DTO => {
  return {
    revision: learningpath.revision,
    revisionMeta: values.revisionMeta,
    language,
    title: values.title,
    description: values.description,
    coverPhotoMetaUrl: values.coverPhotoMetaUrl,
    tags: values.tags,
    responsibleId: values.responsibleId,
    priority: values.priority,
    grepCodes: values.grepCodes,
  };
};
