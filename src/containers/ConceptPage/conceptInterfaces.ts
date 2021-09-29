/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Value } from 'slate';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { VisualElement, Author, Copyright } from '../../interfaces';
import { ConceptStatusType } from '../../modules/concept/conceptApiInterfaces';
import { DraftApiType } from '../../modules/draft/draftApiInterfaces';

export interface ConceptFormValues {
  id?: number;
  language: string;
  revision?: number;
  status?: {
    current: ConceptStatusType;
    other: ConceptStatusType[];
  };

  title?: string;
  content?: string;
  visualElement?: string;
  copyright?: Copyright;
  source?: string;
  metaImage?: {
    id?: string;
    url?: string;
    alt: string;
    language?: string;
  };
  tags: string[];
  subjectIds?: string[];
  articleIds?: number[];
  articles: DraftApiType[];
  slatetitle: Value;
  conceptContent: Value;
  created?: string;
  creators: Author[];
  license?: string;
  metaImageAlt: string;
  metaImageId: string;
  processors: Author[];
  rightsholders: Author[];
  subjects: SubjectType[];
  supportedLanguages: string[];
  updated?: string;
  visualElementObject: VisualElement;
  agreementId?: number;
}
