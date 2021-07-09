/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Value } from 'slate';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { VisualElement, Author, ArticleType } from '../../interfaces';
import {
  ConceptType,
  FormValues,
  StrippedConceptType,
} from '../../modules/concept/conceptApiInterfaces';

export interface ConceptFormType extends ConceptType {
  articles: ArticleType[];
  revision?: string;
}

export interface ConceptFormValues extends StrippedConceptType, FormValues {
  articles: ArticleType[];
  slatetitle: Value;
  conceptContent: Value;
  created?: string;
  creators: Author[];
  license?: string;
  metaImageAlt: string;
  metaImageId: string;
  processors: Author[];
  rightsholders: Author[];
  source: string;
  subjects: SubjectType[];
  supportedLanguages: string[];
  tags: string[];
  updateCreated: boolean;
  updated: string;
  visualElementObject: VisualElement;
  agreementId?: number;
}
