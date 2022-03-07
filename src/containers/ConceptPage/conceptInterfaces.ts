/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { IStatus, IAuthor } from '@ndla/types-concept-api';
import { IArticle } from '@ndla/types-draft-api';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';

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
  subjects: SubjectType[];
  supportedLanguages: string[];
  updated?: string;
  origin?: string;
}
