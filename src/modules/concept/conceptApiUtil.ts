/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  VisualElement,
  ConceptPreviewType,
  ConceptFormikType,
} from '../../interfaces';
import {
  ConceptApiType,
  NewConceptType,
  UpdatedConceptType,
  PreviewMetaImage as ConceptPreviewMetaImage,
  ConceptType,
} from './conceptApiInterfaces';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';

export const transformApiToCleanConcept = (
  concept: ConceptApiType,
  language: string,
): ConceptType => ({
  ...concept,
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  tags: convertFieldWithFallback(concept, 'tags', []),
  visualElement: convertFieldWithFallback(concept, 'visualElement', ''),
  subjectIds: concept.subjectIds || [],
  updated: concept.updated || '',
  updatedBy: concept.updatedBy || [],
  language,
});

export const transformFormikToUpdatedApiVersion = (
  concept: ConceptFormikType,
  language: string,
): UpdatedConceptType => ({
  id: concept.id,
  language: language,
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  ...(concept.metaImageId &&
    concept.metaImageAlt && {
      metaImage: {
        id: concept.metaImageId,
        alt: concept.metaImageAlt,
      },
    }),
  copyright: concept.copyright,
  source: concept.source,
  tags: convertFieldWithFallback(concept, 'tags', []),
  subjectIds: concept.subjectIds,
  articleIds: concept.articleIds.map(article => article.id),
  status: concept.status?.current,
  visualElement: concept.visualElement?.visualElement,
});

export const transformFormikToNewApiVersion = (
  concept: ConceptFormikType,
  language: string,
): NewConceptType => ({
  language: language,
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  ...(concept.metaImageId &&
    concept.metaImageAlt && {
      metaImage: {
        id: concept.metaImageId,
        alt: concept.metaImageAlt,
      },
    }),
  copyright: concept.copyright,
  source: concept.source,
  tags: convertFieldWithFallback(concept, 'tags', []),
  subjectIds: concept.subjectIds,
  articleIds: concept.articleIds.map(article => article.id),
  visualElement: concept.visualElement?.visualElement,
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
