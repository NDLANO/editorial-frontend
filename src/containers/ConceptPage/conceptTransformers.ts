/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node as SlateNode } from "slate";
import { IConceptDTO, ILicenseDTO, INewConceptDTO, IUpdatedConceptDTO } from "@ndla/types-backend/concept-api";
import { ConceptFormValues, ConceptType } from "./conceptInterfaces";
import { IN_PROGRESS } from "../../constants";
import {
  plainTextToEditorValue,
  editorValueToPlainText,
  embedTagToEditorValue,
  editorValueToEmbedTag,
  blockContentToHTML,
  inlineContentToEditorValue,
} from "../../util/articleContentConverter";

export const conceptApiTypeToFormType = (
  concept: IConceptDTO | undefined,
  language: string,
  ndlaId: string | undefined,
  initialTitle = "",
  conceptType?: ConceptType,
): ConceptFormValues => {
  const license = concept?.copyright?.license?.license ?? "N/A";
  const conceptLicense = license === "unknown" ? undefined : license;

  // Make sure to omit the content field from concept. It will crash Slate.
  return {
    id: concept?.id,
    revision: concept?.revision,
    status: concept?.status ?? { current: IN_PROGRESS, other: [] },
    created: concept?.created,
    updated: concept?.updated,
    title: plainTextToEditorValue(concept?.title?.title || initialTitle),
    language,
    conceptContent: inlineContentToEditorValue(concept?.content?.htmlContent || "", true),
    supportedLanguages: concept?.supportedLanguages ?? [language],
    creators: concept?.copyright?.creators ?? [],
    rightsholders: concept?.copyright?.rightsholders ?? [],
    processors: concept?.copyright?.processors ?? [],
    processed: concept?.copyright?.processed ?? false,
    source: concept?.source ?? "",
    license: conceptLicense,
    tags: concept?.tags?.tags ?? [],
    visualElement: embedTagToEditorValue(concept?.visualElement?.visualElement ?? ""),
    origin: concept?.copyright?.origin,
    responsibleId: concept === undefined ? ndlaId : concept?.responsible?.responsibleId,
    conceptType: conceptType || "concept",
    ...(conceptType === "gloss"
      ? {
          gloss: {
            gloss: concept?.glossData?.gloss ?? "",
            wordClass: concept?.glossData?.wordClass ?? "",
            originalLanguage: concept?.glossData?.originalLanguage ?? "",
          },
          examples: concept?.glossData?.examples ?? [],
          transcriptions: concept?.glossData?.transcriptions ?? {},
        }
      : {}),
  };
};

export const getNewConceptType = (
  values: ConceptFormValues,
  licenses: ILicenseDTO[],
  conceptType: ConceptType,
): INewConceptDTO => ({
  language: values.language,
  title: editorValueToPlainText(values.title),
  content: blockContentToHTML(values.conceptContent),
  copyright: {
    license: licenses.find((license) => license.license === values.license),
    origin: values.origin,
    creators: values.creators ?? [],
    processors: values.processors ?? [],
    rightsholders: values.rightsholders ?? [],
    processed: values.processed ?? false,
  },
  tags: values.tags,
  visualElement: editorValueToEmbedTag(values.visualElement),
  responsibleId: values.responsibleId,
  conceptType: conceptType,
  glossData:
    conceptType === "gloss"
      ? {
          gloss: values.gloss?.gloss ?? "",
          wordClass: values.gloss?.wordClass ?? "",
          originalLanguage: values.gloss?.originalLanguage ?? "",
          examples: values.examples ?? [],
          transcriptions: values.transcriptions ?? {},
        }
      : undefined,
});

export const getUpdatedConceptType = (
  values: ConceptFormValues,
  licenses: ILicenseDTO[],
  conceptType: ConceptType,
): IUpdatedConceptDTO => {
  const newConcept = getNewConceptType(values, licenses, conceptType);
  return {
    ...newConcept,
    responsibleId: newConcept.responsibleId,
  };
};

export const conceptFormTypeToApiType = (
  values: ConceptFormValues,
  licenses: ILicenseDTO[],
  conceptType: ConceptType,
  updatedBy?: string[],
): IConceptDTO => {
  return {
    id: values.id ?? -1,
    revision: values.revision ?? -1,
    status: values.status ?? { current: IN_PROGRESS, other: [] },
    visualElement: {
      visualElement: editorValueToEmbedTag(values.visualElement),
      language: values.language,
    },
    source: values.source,
    tags: { tags: values.tags, language: values.language },
    title: {
      title: editorValueToPlainText(values.title),
      language: values.language,
    },
    content: {
      htmlContent: blockContentToHTML(values.conceptContent),
      content: values.conceptContent.map((n) => SlateNode.string(n)).join(""),
      language: values.language,
    },
    created: values.created ?? "",
    updated: values.updated ?? "",
    updatedBy,
    copyright: {
      ...values,
      license: licenses.find((license) => license.license === values.license),
    },
    supportedLanguages: values.supportedLanguages,
    conceptType,
    glossData:
      conceptType === "gloss"
        ? {
            gloss: values.gloss?.gloss ?? "",
            wordClass: values.gloss?.wordClass ?? "",
            originalLanguage: values.gloss?.originalLanguage ?? "",
            examples: values.examples ?? [],
            transcriptions: values.transcriptions ?? {},
          }
        : undefined,
  };
};
