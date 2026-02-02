/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { licenses } from "@ndla/licenses";
import {
  AuthorDTO,
  LearningPathV2DTO,
  NewLearningPathV2DTO,
  UpdatedLearningPathV2DTO,
} from "@ndla/types-backend/learningpath-api";
import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../util/articleContentConverter";

export interface LearningpathFormValues {
  id: number | undefined;
  title: string;
  description: string;
  coverPhotoMetaUrl?: string;
  tags: string[];
  language: string | undefined;
  introduction: Descendant[];
  grepCodes: string[];
  license: string;
  contributors: AuthorDTO[];
  supportedLanguages: string[];
  // This field is only used for error checking in revisions
  responsibleId?: string;
  revisionError?: string;
  status:
    | {
        current: string;
      }
    | undefined;
  priority?: LearningPathV2DTO["priority"];
  revisionMeta: {
    note: string;
    revisionDate: string;
    status: string;
    new?: boolean;
  }[];
}

export const learningpathApiTypeToFormType = (
  learningpath: LearningPathV2DTO | undefined,
  language: string,
  ndlaId: string | undefined,
): LearningpathFormValues => {
  return {
    id: learningpath?.id,
    language: language,
    introduction: blockContentToEditorValue(learningpath?.introduction.introduction ?? ""),
    supportedLanguages: learningpath?.supportedLanguages ?? [],
    title: learningpath?.title.title ?? "",
    grepCodes: learningpath?.grepCodes ?? [],
    description: learningpath?.description.description ?? "",
    coverPhotoMetaUrl: learningpath?.coverPhoto?.metaUrl,
    tags: learningpath?.tags.tags ?? [],
    revisionMeta: learningpath?.revisions ?? [],
    responsibleId: learningpath ? learningpath.responsible?.responsibleId : ndlaId,
    priority: learningpath?.priority ?? "unspecified",
    license: learningpath?.copyright.license.license ?? licenses.CC_BY_4,
    contributors: learningpath?.copyright.contributors ?? [],
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
): NewLearningPathV2DTO => {
  const introduction = blockContentToHTML(values.introduction);
  return {
    language,
    title: values.title,
    introduction: introduction === "<section></section>" ? undefined : introduction,
    description: values.description,
    coverPhotoMetaUrl: values.coverPhotoMetaUrl,
    tags: values.tags,
    responsibleId: values.responsibleId,
    grepCodes: values.grepCodes,
    copyright: values.license
      ? {
          license: {
            license: values.license,
          },
          contributors: values.contributors,
        }
      : undefined,
  };
};

export const learningpathFormTypeToApiType = (
  learningpath: LearningPathV2DTO,
  values: LearningpathFormValues,
  language: string,
): UpdatedLearningPathV2DTO => {
  const introduction = blockContentToHTML(values.introduction);
  return {
    revision: learningpath.revision,
    revisionMeta: values.revisionMeta,
    introduction: introduction === "<section></section>" ? null : introduction,
    language,
    title: values.title,
    description: values.description,
    coverPhotoMetaUrl: values.coverPhotoMetaUrl,
    tags: values.tags,
    responsibleId: values.responsibleId,
    priority: values.priority,
    grepCodes: values.grepCodes,
    copyright: {
      license: {
        license: values.license,
      },
      contributors: values.contributors,
    },
  };
};
