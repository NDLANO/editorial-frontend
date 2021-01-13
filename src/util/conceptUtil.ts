/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArticleType } from '../interfaces';
import {
  ConceptApiType,
  ConceptFormikType,
} from '../modules/concept/conceptApiInterfaces';
import { convertFieldWithFallback } from './convertFieldWithFallback';

export const transformConceptFromApiVersion = (
  concept: ConceptApiType,
  locale: string,
  articleIds: ArticleType[],
): ConceptFormikType => ({
  ...concept,
  articleIds: articleIds,
  title: convertFieldWithFallback(concept, 'title', ''),
  content: convertFieldWithFallback(concept, 'content', ''),
  tags: convertFieldWithFallback(concept, 'tags', []),
  ...(locale ? { language: locale } : {}),
});

export const transformConceptToApiVersion = (
  concept: ConceptFormikType,
): ConceptApiType => ({
  ...concept,
  articleIds: concept.articleIds.map(article => article.id),
});
