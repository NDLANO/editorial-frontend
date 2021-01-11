import { Value } from 'slate';

export interface Values {
  id: number;
  revision: number;
  title: string;
  introduction: Value;
  content: Value;
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

export interface PossibleStatuses {
  CREATED: Array<string>;
  PROPOSAL: Array<string>;
  AWAITING_QUALITY_ASSURANCE: Array<string>;
  DRAFT: Array<string>;
  USER_TEST: Array<string>;
  IMPORTED: Array<string>;
  QUALITY_ASSURED: Array<string>;
  PUBLISHED: Array<string>;
  AWAITING_UNPUBLISHING: Array<string>;
  UNPUBLISHED: Array<string>;
  ARCHIVED: Array<string>;
  QUEUED_FOR_PUBLISHING: Array<string>;
}

export type PreviewTypes =
  | 'previewProductionArticle'
  | 'previewLanguageArticle'
  | 'preview'
  | '';
