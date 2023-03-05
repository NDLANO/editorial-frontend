/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IConcept, ILicense, INewConcept, IUpdatedConcept } from '@ndla/types-concept-api';
import { IArticle } from '@ndla/types-draft-api';
import {
  plainTextToEditorValue,
  editorValueToPlainText,
  embedTagToEditorValue,
  editorValueToEmbedTag,
} from '../../util/articleContentConverter';
import { ConceptFormValues } from './conceptInterfaces';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { parseImageUrl } from '../../util/formHelper';
import { IN_PROGRESS } from '../../constants';

export const conceptApiTypeToFormType = (
  concept: IConcept | undefined,
  language: string,
  subjects: SubjectType[],
  articles: IArticle[],
  initialTitle = '',
): ConceptFormValues => {
  const conceptSubjects = subjects.filter(s => concept?.subjectIds?.find(id => id === s.id)) ?? [];
  const license = concept?.copyright?.license?.license;
  const conceptLicense = license === 'unknown' ? undefined : license;

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
    license: conceptLicense,
    metaImageId: parseImageUrl(concept?.metaImage),
    metaImageAlt: concept?.metaImage?.alt ?? '',
    tags: concept?.tags?.tags ?? [],
    articles,
    visualElement: embedTagToEditorValue(concept?.visualElement?.visualElement ?? ''),
    origin: concept?.copyright?.origin,
    responsibleId: concept?.responsible?.responsibleId,
  };
};

const metaImageFromForm = (v: ConceptFormValues) =>
  v.metaImageId ? { id: v.metaImageId, alt: v.metaImageAlt } : undefined;

export const getNewConceptType = (
  values: ConceptFormValues,
  licenses: ILicense[],
): INewConcept => ({
  language: values.language,
  title: editorValueToPlainText(values.title),
  content: editorValueToPlainText(values.conceptContent),
  copyright: {
    license: licenses.find(license => license.license === values.license),
    origin: values.origin,
    creators: values.creators ?? [],
    processors: values.processors ?? [],
    rightsholders: values.rightsholders ?? [],
  },
  source: values.source,
  tags: values.tags,
  metaImage: metaImageFromForm(values),
  subjectIds: values.subjects.map(subject => subject.id),
  articleIds: values.articles.map(a => a.id),
  visualElement: editorValueToEmbedTag(values.visualElement),
  responsibleId: values.responsibleId,
});

export const getUpdatedConceptType = (
  values: ConceptFormValues,
  licenses: ILicense[],
): IUpdatedConcept => ({
  ...getNewConceptType(values, licenses),
  metaImage: metaImageFromForm(values) ?? null,
});

export const conceptFormTypeToApiType = (
  values: ConceptFormValues,
  licenses: ILicense[],
  updatedBy?: string[],
): IConcept => {
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
