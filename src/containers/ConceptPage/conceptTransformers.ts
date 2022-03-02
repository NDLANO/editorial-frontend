/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IConcept as ConceptApiType,
  ILicense as ConceptApiLicense,
  INewConcept,
  IUpdatedConcept,
} from '@ndla/types-concept-api';
import { IArticle as DraftApiType } from '@ndla/types-draft-api';
import {
  plainTextToEditorValue,
  editorValueToPlainText,
  embedTagToEditorValue,
  editorValueToEmbedTag,
} from '../../util/articleContentConverter';
import { ConceptFormValues } from './conceptInterfaces';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { parseImageUrl } from '../../util/formHelper';
import {DRAFT} from "../../util/constants/ConceptStatus";

export const conceptApiTypeToFormType = (
  concept: ConceptApiType | undefined,
  language: string,
  subjects: SubjectType[],
  articles: DraftApiType[],
  initialTitle = '',
): ConceptFormValues => {
  const conceptSubjects = subjects.filter(s => concept?.subjectIds?.find(id => id === s.id)) ?? [];
  // Make sure to omit the content field from concept. It will crash Slate.
  return {
    id: concept?.id,
    revision: concept?.revision,
    status: concept?.status,
    metaImage: concept?.metaImage,
    created: concept?.created,
    updated: concept?.updated,
    title: plainTextToEditorValue(concept?.title?.title || initialTitle),
    language,
    subjects: conceptSubjects,
    conceptContent: plainTextToEditorValue(concept?.content?.content || ''),
    supportedLanguages: concept?.supportedLanguages ?? [language],
    creators: concept?.copyright?.creators ?? [],
    rightsholders: concept?.copyright?.rightsholders ?? [],
    processors: concept?.copyright?.processors ?? [],
    source: concept?.source ?? '',
    license: concept?.copyright?.license?.license ?? '',
    metaImageId: parseImageUrl(concept?.metaImage),
    metaImageAlt: concept?.metaImage?.alt ?? '',
    tags: concept?.tags?.tags ?? [],
    articles,
    visualElement: embedTagToEditorValue(concept?.visualElement?.visualElement ?? ''),
  };
};

const metaImageFromForm = (v: ConceptFormValues) =>
  v.metaImageId ? { id: v.metaImageId, alt: v.metaImageAlt } : undefined;

export const getConceptPostType = (
  values: ConceptFormValues,
  licenses: ConceptApiLicense[],
): INewConcept => ({
  ...values,
  title: editorValueToPlainText(values.title),
  content: editorValueToPlainText(values.conceptContent),
  copyright: {
    license: licenses.find(license => license.license === values.license),
    creators: values.creators ?? [],
    processors: values.processors ?? [],
    rightsholders: values.rightsholders ?? [],
  },
  metaImage: metaImageFromForm(values),
  subjectIds: values.subjects.map(subject => subject.id),
  articleIds: values.articles.map(a => a.id),
  visualElement: editorValueToEmbedTag(values.visualElement),
});

export const getConceptPatchType = (
  values: ConceptFormValues,
  licenses: ConceptApiLicense[],
): IUpdatedConcept => ({
  ...getConceptPostType(values, licenses),
  metaImage: metaImageFromForm(values) ?? null,
});

export const conceptFormTypeToApiType = (
  values: ConceptFormValues,
  licenses: ConceptApiLicense[],
  updatedBy?: string[],
): ConceptApiType => {
  return {
    id: values.id ?? -1,
    revision: values.revision ?? -1,
    status: values.status ?? { current: DRAFT, other: [] },
    visualElement: {
      visualElement: editorValueToEmbedTag(values.visualElement),
      language: values.language,
    },
    source: values.source,
    tags: { tags: values.tags, language: values.language },
    articleIds: values.articles.map(a => a.id),
    title: {
      title: editorValueToPlainText(values.title),
      language: values.language,
    },
    content: { content: editorValueToPlainText(values.conceptContent), language: values.language },
    created: values.created ?? '',
    updated: values.updated ?? '',
    metaImage: {
      url: values.metaImage?.url ?? '',
      alt: values.metaImageAlt,
      language: values.metaImage?.language ?? values.language,
    },
    subjectIds: values.subjects.map(subject => subject.id),

    updatedBy,
    copyright: {
      ...values,
      license: licenses.find(license => license.license === values.license),
    },
    supportedLanguages: values.supportedLanguages,
  };
};
