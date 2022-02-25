/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';

export interface Values {
  id: number;
  revision: number;
  title: Descendant[];
  introduction: Descendant[];
  content: Descendant[];
  tags: Array<string>;
  creators: string;
  processors: string;
  rightsholders: string;
  updated: boolean;
  published: boolean;
  updatePublished: boolean;
  origin: string;
  license: string;
  metaDescription: string;
  metaImageId: string;
  metaImageAlt: string;
  supportedLanguages: Array<string>;
  agreementId: string;
  language: string;
  articleType: string;
  status: Array<string>;
  notes: Array<string>;
}

export interface Article {
  id: number;
  title: string;
  introduction: string;
  tags: Array<string>;
  content: string;
  metaImage: {
    id: number;
    alt: string;
  };
  metaDescription: string;
  articleType: string;
  copyright: {
    license: string;
    origin: string;
    creators: Array<string>;
    processors: Array<string>;
    rightsholders: Array<string>;
  };
  notes: Array<string>;
  language: string;
  published: string;
  supportedLanguages: Array<string>;
}
