/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { plainTextToEditorValue, editorValueToPlainText } from '../../util/articleContentConverter';
import { createEmbedTag } from '../../util/embedTagHelpers';
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
import { parseEmbedTag } from '../../util/embedTagHelpers';

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
): ConceptFormValues => {
  const { title, content, tags, visualElement } = convertNestedConceptProps(concept, language);
  const conceptSubjects = subjects.filter(s => concept?.subjectIds.find(id => id === s.id)) ?? [];
  const spreadConcept: Partial<ConceptApiType> = concept ? { ...concept, content: undefined } : {};
  if (spreadConcept.hasOwnProperty('content')) {
    delete spreadConcept.content;
  }
  return {
    id: concept?.id,
    revision: concept?.revision,
    status: concept?.status,
    visualElement: concept?.visualElement?.visualElement,
    copyright: concept?.copyright,
    metaImage: concept?.metaImage,
    subjectIds: concept?.subjectIds,
    articleIds: concept?.articleIds,
    created: concept?.created,
    updated: concept?.updated,
    slatetitle: plainTextToEditorValue(title, true),
    language,
    subjects: conceptSubjects,
    conceptContent: plainTextToEditorValue(content, true),
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
    visualElementObject: parseEmbedTag(visualElement) || {},
  };
};

const metaImageFromForm = (v: ConceptFormValues) =>
  v.metaImageId ? { id: v.metaImageId, alt: v.metaImageAlt } : undefined;

export const getConceptPostType = (
  values: ConceptFormValues,
  licenses: License[],
): ConceptPostType => ({
  ...values,
  title: editorValueToPlainText(values.slatetitle),
  content: editorValueToPlainText(values.conceptContent),
  copyright: {
    license: licenses.find(license => license.license === values.license),
    ...values.copyright!,
  },
  metaImage: metaImageFromForm(values),
  subjectIds: values.subjects.map(subject => subject.id),
  articleIds: values.articles.map(a => a.id),
  visualElement: createEmbedTag(values.visualElementObject),
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
    ...values,
    id: values.id!,
    revision: values.revision!,
    title: {
      title: editorValueToPlainText(values.slatetitle),
      language: values.language,
    },
    content: { content: editorValueToPlainText(values.conceptContent), language: values.language },
    metaImage: { url: '', alt: '', language: values.language },
    subjectIds: values.subjects.map(subject => subject.id),
    articleIds: values.articles?.map(a => a.id) ?? [],
    visualElement: {
      visualElement: createEmbedTag(values.visualElementObject),
      language: values.language,
    },
    updatedBy,
    tags: {
      tags: values.tags,
      language: values.language,
    },
    created: values.created!,
    updated: values.updated!,
    status: values.status!,
    copyright: {
      license: licenses.find(license => license.license === values.license),
      creators: values.creators,
      processors: values.processors,
      rightsholders: values.rightsholders,
    },
  };
};
