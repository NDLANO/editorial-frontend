/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  SubjectType,
  VisualElement,
  Author,
  StrippedConceptType,
  ConceptType,
  ArticleType,
  Status,
  FormValues,
} from '../../interfaces';

export interface ConceptFormType extends ConceptType {
  articles: ArticleType[];
  revision?: string;
}

export interface ConceptFormValues extends StrippedConceptType, FormValues {
  creators: Author[];
  created?: string;
  title: string;
  conceptContent: string;
  agreementId?: number;
  updateCreated: boolean;
  visualElementObject: VisualElement;
  rightsholders: Author[];
  processors: Author[];
  license?: string;
  metaImageAlt: string;
  updated: string;
  supportedLanguages: string[];
  articles: ArticleType[];
  status: Status;
  metaImageId: string;
  subjects: SubjectType[];
  tags: string[];
  language: string;
}
