/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApiConceptType } from './conceptApiInterfaces';
import { ConceptType } from '../../interfaces';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';
import { parseEmbedTag } from '../../util/embedTagHelpers';
import { parseImageUrl } from '../../util/formHelper';

export const transformApiToCleanConcept = (
  concept: ApiConceptType,
  language: string,
): ConceptType => {
  const visualElementEmbed = convertFieldWithFallback(concept, 'visualElement', '');
  const parsedVisualElement = parseEmbedTag(visualElementEmbed);
  return {
    ...concept,
    title: convertFieldWithFallback(concept, 'title', ''),
    content: convertFieldWithFallback(concept, 'content', ''),
    tags: convertFieldWithFallback(concept, 'tags', []),
    visualElement: visualElementEmbed,
    subjectIds: concept.subjectIds || [],
    updated: concept.updated || '',
    updatedBy: concept.updatedBy || [],
    metaImageId: parseImageUrl(concept.metaImage),
    parsedVisualElement,
    language,
  };
};
