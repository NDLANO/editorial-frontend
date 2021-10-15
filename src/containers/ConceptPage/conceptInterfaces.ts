/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { ConceptApiType, ConceptStatusType } from '../../modules/concept/conceptApiInterfaces';
import { DraftApiType } from '../../modules/draft/draftApiInterfaces';

import { Author, ArticleType } from '../../interfaces';

export interface ConceptFormType extends ConceptApiType {
  articles: ArticleType[];
}

export interface ConceptFormValues {
  id?: number;
  language: string;
  revision?: number;
  status?: {
    current: ConceptStatusType;
    other: ConceptStatusType[];
  };
  visualElement: Descendant[];
  source?: string;
  metaImage?: {
    id?: string;
    url?: string;
    alt: string;
    language?: string;
  };
  tags: string[];
  articles: DraftApiType[];
  title: Descendant[];
  conceptContent: Descendant[];
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
}
