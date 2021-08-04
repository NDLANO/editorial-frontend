/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApiConceptType, ConceptType } from './conceptApiInterfaces';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { parseImageUrl } from '../../util/formHelper';

export const transformApiToCleanConcept = (
  concept: ApiConceptType,
  language: string,
): ConceptType => {
  const visualElementEmbed = convertFieldWithFallback<'visualElement'>(
    concept,
    'visualElement',
    '',
  );
  return {
    ...concept,
    title: convertFieldWithFallback<'title'>(concept, 'title', ''),
    content: convertFieldWithFallback<'content'>(concept, 'content', ''),
    tags: convertFieldWithFallback<'tags', string[]>(concept, 'tags', []),
    visualElement: visualElementEmbed,
    subjectIds: concept.subjectIds || [],
    updated: concept.updated || '',
    updatedBy: concept.updatedBy || [],
    metaImageId: parseImageUrl(concept.metaImage),
    language,
  };
};
