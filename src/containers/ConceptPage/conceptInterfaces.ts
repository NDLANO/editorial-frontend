/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import {IStatus} from "@ndla/types-concept-api";
import { IArticle as DraftApiType } from '@ndla/types-draft-api';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { Author } from '../../interfaces';

export interface ConceptFormValues {
  id?: number;
  language: string;
  revision?: number;
  status?: IStatus
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
