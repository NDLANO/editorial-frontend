/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArticleType, VisualElement, ConceptPreviewType } from '../interfaces';
import {
  ConceptApiType,
  ConceptFormikType,
  NewConceptType,
  UpdatedConceptType,
  PreviewMetaImage as ConceptPreviewMetaImage,
} from '../modules/concept/conceptApiInterfaces';
import { convertFieldWithFallback } from './convertFieldWithFallback';
import { createEmbedTag, parseEmbedTag } from './embedTagHelpers';
import { parseImageUrl, parseCopyrightContributors } from './formHelper';
import { nullOrUndefined } from './articleUtil';

export const transformApiToFormikVersion = (
  concept: ConceptApiType,
  language: string,
  articleIds: ArticleType[],
): ConceptFormikType => ({
  ...concept,
  articleIds,
  language: language,
  creators: parseCopyrightContributors(concept, 'creators'),
  rightsholders: parseCopyrightContributors(concept, 'rightsholders'),
  processors: parseCopyrightContributors(concept, 'processors'),
  license: concept.copyright?.license || { license: '' },
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  tags: convertFieldWithFallback(concept, 'tags', []),
  metaImageId: parseImageUrl(concept.metaImage),
  metaImageAlt: concept.metaImage?.alt || '',
  visualElement: parseEmbedTag(concept.visualElement?.visualElement),
  ...(language ? { language: language } : {}),
});

export const transformFormikToUpdatedApiVersion = (
  concept: ConceptFormikType,
  language: string,
): UpdatedConceptType => ({
  id: concept.id,
  language: language,
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  metaImage:
    concept.metaImageId && concept.metaImageAlt
      ? {
          id: concept.metaImageId,
          alt: concept.metaImageAlt,
        }
      : nullOrUndefined(concept?.metaImageId),
  copyright: {
    license: concept.license,
    creators: concept.creators,
    processors: concept.processors,
    rightsholders: concept.rightsholders,
    agreementId: concept.agreementId,
  },
  source: concept.source,
  tags: concept.tags,
  subjectIds: concept.subjectIds,
  articleIds: concept.articleIds.map(article => article.id),
  status: concept.status?.current,
  visualElement: createEmbedTag(concept.visualElement || {}),
});

export const transformFormikToNewApiVersion = (
  concept: ConceptFormikType,
  language: string,
): NewConceptType => ({
  language: language,
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  metaImage:
    concept.metaImageId && concept.metaImageAlt
      ? {
          id: concept.metaImageId,
          alt: concept.metaImageAlt,
        }
      : nullOrUndefined(concept?.metaImageId),
  copyright: {
    license: concept.license,
    creators: concept.creators,
    processors: concept.processors,
    rightsholders: concept.rightsholders,
    agreementId: concept.agreementId,
  },
  source: concept.source,
  tags: concept.tags,
  subjectIds: concept.subjectIds,
  articleIds: concept.articleIds.map(article => article.id),
  visualElement: createEmbedTag(concept.visualElement || {}),
});

export const transformApiToPreviewVersion = (
  concept: ConceptApiType,
  language: string,
  visualElement: VisualElement,
  metaImage: ConceptPreviewMetaImage,
): ConceptPreviewType => {
  const { status, ...relevantConceptValues } = concept;
  return {
    ...relevantConceptValues,
    title: convertFieldWithFallback(concept, 'title', ''),
    content: convertFieldWithFallback(concept, 'content', ''),
    tags: convertFieldWithFallback(concept, 'tags', []),
    subjectIds: relevantConceptValues.subjectIds || [],
    visualElement,
    language,
    metaImage,
  };
};

export const transformFormikToPreviewVersion = (
  concept: ConceptFormikType,
): ConceptPreviewType => {
  return {
    id: concept.id,
    title: concept.title,
    tags: concept.tags || [],
    content: concept.content,
    copyright: {
      license: concept.license,
      creators: concept.creators,
      processors: concept.processors,
      rightsholders: concept.rightsholders,
      agreementId: concept.agreementId,
    },
    language: concept.language,
    supportedLanguages: concept.supportedLanguages,
    articleIds: concept.articleIds.map(article => article.id),
    created: concept.created,
    source: concept.source,
    subjectIds: concept.subjectIds || [],
    visualElement: concept.visualElement,
  };
};
