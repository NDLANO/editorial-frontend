/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import {
  SubjectType,
  VisualElement,
  Author,
  StrippedConceptType,
  ConceptType,
  ArticleType,
  FormValues,
} from '../../interfaces';

export interface ConceptFormType extends ConceptType {
  articles: ArticleType[];
  revision?: string;
}

export interface ConceptFormValues extends StrippedConceptType, FormValues {
  articles: ArticleType[];
  slatetitle: Descendant[];
  conceptContent: Descendant[];
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
