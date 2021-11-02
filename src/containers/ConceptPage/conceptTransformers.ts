/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  plainTextToEditorValue,
  editorValueToPlainText,
  embedTagToEditorValue,
  editorValueToEmbedTag,
} from '../../util/articleContentConverter';
import {
  ConceptApiType,
  ConceptPostType,
  ConceptPatchType,
} from '../../modules/concept/conceptApiInterfaces';
import { License } from '../../interfaces';
import { ConceptFormValues } from './conceptInterfaces';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { DraftApiType } from '../../modules/draft/draftApiInterfaces';
import { parseImageUrl } from '../../util/formHelper';

const convertNestedConceptProps = (concept: ConceptApiType | undefined, language: string) => {
  if (concept) {
    const conceptLanguage = concept.supportedLanguages.includes(language) ? language : undefined;
    return {
      title: convertFieldWithFallback<'title'>(concept, 'title', '', conceptLanguage),
      content: convertFieldWithFallback<'content'>(concept, 'content', '', conceptLanguage),
      tags: convertFieldWithFallback<'tags', string[]>(concept, 'tags', [], conceptLanguage),
      visualElement: convertFieldWithFallback<'visualElement'>(concept, 'visualElement', ''),
    };
  }
  return { title: '', content: '', tags: [] as string[], visualElement: '' };
};

export const conceptApiTypeToFormType = (
  concept: ConceptApiType | undefined,
  language: string,
  subjects: SubjectType[],
  articles: DraftApiType[],
  initialTitle = '',
): ConceptFormValues => {
  const { title: conceptTitle, content, tags, visualElement } = convertNestedConceptProps(
    concept,
    language,
  );
  const conceptSubjects = subjects.filter(s => concept?.subjectIds?.find(id => id === s.id)) ?? [];
  const title = conceptTitle === '' ? initialTitle : conceptTitle;
  // Make sure to omit the content field from concept. It will crash Slate.
  return {
    id: concept?.id,
    revision: concept?.revision,
    status: concept?.status,
    metaImage: concept?.metaImage,
    created: concept?.created,
    updated: concept?.updated,
    title: plainTextToEditorValue(title || ''),
    language,
    subjects: conceptSubjects,
    conceptContent: plainTextToEditorValue(content || ''),
    supportedLanguages: concept?.supportedLanguages ?? [language],
    creators: concept?.copyright?.creators ?? [],
    rightsholders: concept?.copyright?.rightsholders ?? [],
    processors: concept?.copyright?.processors ?? [],
    source: concept?.source ?? '',
    license: concept?.copyright?.license?.license ?? '',
    metaImageId: parseImageUrl(concept?.metaImage),
    metaImageAlt: concept?.metaImage?.alt ?? '',
    tags,
    articles,
    visualElement: embedTagToEditorValue(visualElement),
  };
};

const metaImageFromForm = (v: ConceptFormValues) =>
  v.metaImageId ? { id: v.metaImageId, alt: v.metaImageAlt } : undefined;

export const getConceptPostType = (
  values: ConceptFormValues,
  licenses: License[],
): ConceptPostType => ({
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
  licenses: License[],
): ConceptPatchType => ({
  ...getConceptPostType(values, licenses),
  id: values.id!,
  metaImage: metaImageFromForm(values) ?? null,
});

export const conceptFormTypeToApiType = (
  values: ConceptFormValues,
  licenses: License[],
  updatedBy?: string[],
): ConceptApiType => {
  return {
    id: values.id ?? -1,
    revision: values.revision ?? -1,
    status: values.status ?? { current: 'DRAFT', other: [] },
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
