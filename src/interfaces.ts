/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import { Editor, Node } from 'slate';
import { Store } from 'redux';

export type ConceptStatusType =
  | 'DRAFT'
  | 'QUALITY_ASSURED'
  | 'PUBLISHED'
  | 'QUEUED_FOR_LANGUAGE'
  | 'ARCHIVED'
  | 'TRANSLATED'
  | 'UNPUBLISHED';

export type AvailabilityType = 'everyone' | 'teacher' | 'student';

export interface TranslateType {
  (
    key: string,
    values?: {
      [key: string]: string | number;
    },
  ): string;
}

export interface Author {
  name: string;
  type: string;
}

export interface Status {
  current: string;
  other: string[];
}

export interface Note {
  note: string;
  user: string;
  status: Status;
  timestamp: string;
}

export interface Copyright {
  license?: License;
  origin?: string;
  creators: Author[];
  processors?: Author[];
  rightsholders: Author[];
  agreementId?: number;
  validFrom?: string;
  validTo?: string;
}

export interface CodeBlockType {
  code: string;
  title: string;
  format: string;
}

export interface ResourceType {
  id: string;
  name: string;
  resources?: Resource[];
}

export interface ResourceTranslation {
  name: string;
  language: string;
}

export interface MetaImage {
  alt: string;
  url: string;
  language: string;
}

export interface ContentResultType {
  articleType: string;
  id: number;
  title: { title: string };
  url?: string;
  metaDescription?: { metaDescription: string };
  metaImage?: MetaImage;
  metaUrl?: string;
  contexts: [
    {
      learningResourceType: string;
      resourceTypes: ResourceType[];
    },
  ];
  learningResourceType?: string;
  supportedLanguages?: string[];
  highlights: [
    {
      field: string;
      matches: string[];
    },
  ];
}

export interface ArticleType {
  id: number;
  title: {
    title: string;
    language: string;
  };
  language: string;
  agreementId: number;
  introduction: string;
  validTo: string;
  validFrom: string;
  visualElement: string;
  metaDescription: string;
  tags: string[];
  published: string;
  copyright: Copyright;
  metaImage: MetaImage;
  oldNdlaUrl: string;
  revision: number;
  updated: string;
  supportedLanguages: string[];
  updatedBy: string;
  articleType: string;
  created: string;
  contentUri: string;
  requiredLibraries: [
    {
      mediaType: string;
      url: string;
      name: string;
    },
  ];
  notes: Note[];
  taxonomy: {
    topics: [
      {
        id: string;
        name: string;
        contentUri: string;
        path: string;
        paths: string[];
      },
    ];
  };
  status: Status;
  content: string;
  grepCodes: string[];
  conceptIds: number[];
}

export interface TaxonomyMetadata {
  grepCodes: string[];
  visible: boolean;
}

export interface TaxonomyElement {
  id: string;
  name: string;
  metadata?: TaxonomyMetadata;
}

export interface Topic extends TaxonomyElement {
  contentUri: string;
  path: string;
  paths: string[];
}

export interface Resource extends TaxonomyElement {
  connectionId: string;
  contentUri?: string;
  isPrimary: boolean;
  path: string;
  paths: string[];
  rank: number;
  resourceTypes: [
    {
      id: string;
      name: string;
    },
  ];
  topicId: string;
}

export interface Learningpath {
  copyright: {
    license: License;
    contributors: [
      {
        type: string;
        name: string;
      },
    ];
  };
  duration: number;
  canEdit: boolean;
  verificationStatus: string;
  lastUpdated: string;
  description: {
    description: string;
    language: string;
  };
  tags: {
    tags: string[];
    language: string;
  };
  isBasedOn: number;
  learningsteps: [
    {
      seqNo: number;
      metaUrl: string;
      id: number;
      title: {
        title: string;
        language: string;
      };
      type: string;
    },
  ];
  metaUrl: string;
  revision: number;
  learningstepUrl: string;
  id: number;
  status: string;
  ownerId: string;
  supportedLanguages: string[];
  message: {
    message: string;
    date: string;
  };
  coverPhoto: {
    url: string;
    metaUrl: string;
  };
  title: {
    title: string;
    language: string;
  };
}

export interface Filter {
  id: string;
  connectionId: string;
  relevanceId: string;
  name: string;
}

export interface SearchResult {
  totalCount: number;
  page: number;
  pageSize: number;
  language: string;
  results: string[];
}

export interface SubjectType {
  id: string;
  contentUri: string;
  name: string;
  path: string;
}

export interface SubjectpageType {
  facebook?: string;
  filters?: string[];
  goTo?: string[];
  id?: string;
  latestContent?: string[];
  layout?: string;
  metaDescription?: string;
  mostRead?: string[];
  name: string;
  topical?: string;
  twitter?: string;
  supportedLanguages?: string[];
}

export interface SubjectpageApiType extends SubjectpageType {
  about: {
    visualElement: {
      type: string;
      url: string;
      alt: string;
      caption: string;
      resource_id: string;
    };
    title: string;
    description: string;
  };
  banner: {
    mobileUrl: string;
    mobileId: number;
    desktopUrl: string;
    desktopId: number;
  };
  editorsChoices: string[];
}

export interface SubjectpageEditType extends SubjectpageType {
  articleType?: string;
  description?: string;
  desktopBanner?: VisualElement;
  editorsChoices?: ArticleType[];
  language: string;
  mobileBanner?: number;
  elementId?: string;
  title?: string;
  visualElement?: VisualElement;
}

export interface NdlaFilmType {
  name: string;
}

export interface NdlaFilmApiType extends NdlaFilmType {
  about: [
    {
      description: string;
      language: string;
      title: string;
      visualElement: {
        alt: string;
        id: string;
        type: string;
      };
    },
  ];
  themes: NdlaFilmThemesApiType[];
  slideShow: string[];
}

export interface NdlaFilmEditType extends NdlaFilmType {
  articleType: string;
  title: string;
  description: string;
  visualElement: VisualElement;
  language: string;
  supportedLanguages: string[];
  themes: NdlaFilmThemesEditType[];
  slideShow: ContentResultType[];
}

export interface NdlaFilmThemesApiType {
  movies: string[];
  name: [
    {
      name: string;
      language: string;
    },
  ];
}
export interface NdlaFilmThemesEditType {
  movies: ContentResultType[];
  name: [
    {
      name: string;
      language: string;
    },
  ];
}

export interface VisualElement {
  resource: string;
  resource_id: string;
  account?: string;
  align?: string;
  alt?: string;
  caption?: string;
  metaData?: any;
  path?: string;
  player?: string;
  title?: string;
  size?: string;
  url?: string;
  videoid?: string;
  'focal-x'?: string;
  'focal-y'?: string;
  'lower-right-y'?: string;
  'lower-right-x'?: string;
  'upper-left-y'?: string;
  'upper-left-x'?: string;
}

export interface SlateFigureProps {
  attributes?: {
    'data-key': string;
    'data-slate-object': string;
  };
  editor: SlateEditor;
  isSelected: boolean;
  language: string;
  node: Node;
}

export interface CodeBlockProps {
  attributes: {
    'data-key': string;
    'data-slate-object': string;
  };
  editor: SlateEditor;
  node: Node;
}

export interface SlateEditor extends Editor {
  props: {
    submitted: boolean;
    slateStore: Store;
  };
}

export interface Embed {
  account?: string;
  align: string;
  alt: string;
  caption: string;
  metaData?: {
    name: string;
  };
  player?: string;
  resource: string;
  resource_id: number;
  size: string;
  type: string;
  url: string;
  videoid: string;

  'focal-x': string;
  'focal-y': string;
  'upper-left-x': string;
  'upper-left-y': string;
  'lower-right-x': string;
  'lower-right-y': string;
}

export interface Audio {
  audioFile: {
    filesize: number;
    language: string;
    mimeType: string;
    url: string;
  };
  caption: string;
  copyright: Copyright;
  id: number;
  revision: number;
  supportedLanguages: string[];
  tags: {
    language: string;
    tags: string[];
  };
  title: string;
}

export interface FormikInputEvent {
  preventDefault: Function;
  target: {
    value: string;
    name: string;
  };
}

export interface AccordionProps {
  openIndexes: string[];
  handleItemClick: Function;
}

export interface FormikProperties {
  field: FieldProps<FormikValues>['field'];
  form: FormikHelpers<FormikValues>;
}

export interface License {
  license: string;
  description: string;
  url?: string;
}

export interface StrippedConceptType {
  id: number;
  title?: string;
  content?: string;
  visualElement?: string;
  language: string;
  copyright?: Copyright;
  source?: string;
  metaImage?: {
    id?: string;
    url: string;
    alt: string;
    language: string;
  };
  tags: string[];
  subjectIds?: string[];
  articleIds?: number[];
}

export interface ConceptType extends StrippedConceptType {
  title: string;
  content: string;
  visualElement: string;
  subjectIds: string[];
  articleIds: number[];
  lastUpdated?: string;
  updatedBy: string[];
  supportedLanguages: string[];
  status: Status;
  created: string;
  updated: string;
  metaImageId: string;
  parsedVisualElement: VisualElement;
}

export interface ConceptPreviewType extends ConceptType {
  visualElementResources: VisualElement;
}

export interface ConceptFormType extends ConceptType {
  articles: ArticleType[];
}
