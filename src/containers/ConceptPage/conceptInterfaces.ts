/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { IStatus, IAuthor, IGlossExample } from '@ndla/types-backend/concept-api';
import { IArticle } from '@ndla/types-backend/draft-api';
import { Node } from '@ndla/types-taxonomy';
import { ROMANIZATION_OPTIONS } from '../GlossPage/glossData';
export interface ConceptFormValues {
  id?: number;
  language: string;
  revision?: number;
  status?: IStatus;
  visualElement: Descendant[];
  source?: string;
  metaImage?: {
    id?: string;
    url?: string;
    alt: string;
    language?: string;
  };
  tags: string[];
  articles: IArticle[];
  title: Descendant[];
  conceptContent: Descendant[];
  created?: string;
  creators: IAuthor[];
  license?: string;
  metaImageAlt: string;
  metaImageId: string;
  processors: IAuthor[];
  rightsholders: IAuthor[];
  processed: boolean;
  subjects: Node[];
  supportedLanguages: string[];
  updated?: string;
  origin?: string;
  responsibleId?: string;
  conceptType: 'concept' | 'gloss';
  gloss?: {
    gloss: string;
    wordClass: string;
    originalLanguage: string;
  };
  examples?: IGlossExample[][];
  transcriptions?: {
    [key in (typeof ROMANIZATION_OPTIONS)[number]]?: string;
  };
}
