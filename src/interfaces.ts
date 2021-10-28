/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import { Editor } from 'slate';
import { Store } from 'redux';

import { AudioApiType } from './modules/audio/audioApiInterfaces';
import { ReduxImageState } from './modules/image/image';
import { SearchTypeValues, LOCALE_VALUES } from './constants';
import { Resource } from './modules/taxonomy/taxonomyApiInterfaces';
import { ConceptApiType } from './modules/concept/conceptApiInterfaces';
import { DraftApiType } from './modules/draft/draftApiInterfaces';
import { DraftStatus } from './modules/draft/draftApiInterfaces';
import { FootnoteType } from './containers/ArticlePage/LearningResourcePage/components/LearningResourceFootnotes';
import { ArticleTaxonomy } from './containers/FormikForm/formikDraftHooks';

export type LocaleType = typeof LOCALE_VALUES[number];

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type AvailabilityType = 'everyone' | 'teacher' | 'student';

export type EditMode =
  | 'changeSubjectName'
  | 'deleteTopic'
  | 'addExistingSubjectTopic'
  | 'openCustomFields'
  | 'toggleMetadataVisibility'
  | 'editGrepCodes'
  | 'addExistingTopic'
  | 'addTopic'
  | 'deleteSubject';

export interface FormikFormBaseType {
  language: string;
  supportedLanguages: string[];
}

export interface SearchResultBase<T> {
  totalCount: number;
  page?: number;
  pageSize: number;
  language?: string;
  results: T[];
}

export interface Author {
  name: string;
  type: string;
}

export interface Note {
  note: string;
  user: string;
  status: {
    current: string;
    other: string[];
  };
  timestamp: string;
}

export interface Copyright {
  license?: License;
  origin?: string;
  creators: Author[];
  processors: Author[];
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

export interface ImageType {
  id: string;
  metaUrl: string;
  title: string;
  alttext: string;
  imageUrl: string;
  size: number;
  contentType: string;
  copyright: Copyright;
  tags: string[];
  caption: string;
  supportedLanguages: string[];
  language: string;
}

export interface MetaImage {
  alt: string;
  url: string;
  language: string;
}

export interface FlattenedResourceType {
  id: string;
  name: string;
  typeId?: string;
  typeName?: string;
}

export interface ContentResultType {
  articleType: string;
  contexts: [
    {
      learningResourceType: string;
      resourceTypes: { id: string; name: string; resources?: Resource[] }[];
    },
  ];
  id: number;
  title: { title: string; language: string };
  url?: string;
  license?: string;
  metaDescription?: { metaDescription: string; language: string };
  metaImage?: MetaImage;
  metaUrl?: string;
  altText?: {
    alttext: string;
    language: string;
  };
  learningResourceType?: string;
  supportedLanguages?: string[];
  previewUrl?: string;
  highlights: [
    {
      field: string;
      matches: string[];
    },
  ];
}

export interface Auth0UserData {
  app_metadata: {
    ndla_id: string;
  };
  name: string;
}

export interface ZendeskToken {
  token: string;
}

export interface ArticleType {
  id: number;
  title: string;
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
  status: DraftStatus;
  content: string;
  grepCodes: string[];
  conceptIds: number[];
  relatedContent: RelatedContent[];
  availability?: AvailabilityType;
  metaData?: {
    footnotes?: FootnoteType[];
  };
}

export interface RelatedContentLink {
  title: string;
  url: string;
}

export type TypeOfPreview =
  | 'preview'
  | 'previewLanguageArticle'
  | 'previewVersion'
  | 'previewProductionArticle';

export type RelatedContent = RelatedContentLink | number;

export type ConvertedRelatedContent = RelatedContent | DraftApiType;

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

export interface SearchResult {
  totalCount: number;
  page: number;
  pageSize: number;
  language: string;
  results: string[];
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
      type: 'brightcove' | 'image';
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
  desktopBanner?: ImageEmbed;
  editorsChoices?: ArticleType[];
  language: string;
  mobileBanner?: number;
  elementId?: string;
  title?: string;
  visualElement?: PartialVisualElement;
}

type PartialVisualElement =
  | (Omit<Partial<BrightcoveEmbed>, 'resource'> & { resource: 'brightcove' | 'video' })
  | (Omit<Partial<ImageEmbed>, 'resource'> & { resource: 'image' });

export interface NdlaFilmType {
  name: string;
}

export interface NdlaFilmVisualElement {
  alt: string;
  url: string;
  type: string;
}

export interface NdlaFilmApiType extends NdlaFilmType {
  about: {
    description: string;
    language: string;
    title: string;
    visualElement: NdlaFilmVisualElement;
  }[];
  themes: NdlaFilmThemesApiType[];
  slideShow: string[];
}

export interface NdlaFilmEditType extends NdlaFilmType {
  articleType: string;
  title: string;
  description: string;
  visualElement: Embed;
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
  name: {
    name: string;
    language: string;
  }[];
}

export interface SlateEditor extends Editor {
  props: {
    submitted: boolean;
    slateStore: Store;
  };
}
export type MessageSeverity = 'danger' | 'info' | 'success' | 'warning';
export interface ImageEmbed {
  resource: 'image';

  resource_id: string;
  size: string;
  align: string;
  alt: string;
  caption: string;
  url?: string;
  'focal-x'?: string;
  'focal-y'?: string;
  'lower-right-y'?: string;
  'lower-right-x'?: string;
  'upper-left-y'?: string;
  'upper-left-x'?: string;
  metaData?: any;
}

export interface BrightcoveEmbed {
  resource: 'brightcove' | 'video';
  videoid: string;
  caption: string;
  account: string;
  player: string;
  title: string;
  metaData?: any;
}

export interface AudioEmbed {
  resource: 'audio';
  resource_id: string;
  caption: string;
  type: string;
  url: string;
}

export interface H5pEmbed {
  resource: 'h5p';
  path: string;
  url: string;
  title?: string;
}

export interface ExternalEmbed {
  resource: 'external' | 'iframe';
  url: string;
  metaData?: any;
  caption?: string;
  title?: string;
}

export interface ErrorEmbed {
  resource: 'error';
  message: string;
}

export type Embed =
  | ImageEmbed
  | BrightcoveEmbed
  | AudioEmbed
  | H5pEmbed
  | ExternalEmbed
  | ErrorEmbed;

export interface FileFormat {
  url: string;
  fileType: string;
  tooltip: string;
}

export interface File {
  path: string;
  resource: string;
  title: string;
  type: string;
  url: string;
  display?: string;
  formats?: FileFormat[];
}

export interface UnsavedFile {
  path: string;
  title: string;
  type: string;
}

export interface SlateAudio extends Omit<AudioApiType, 'title'> {
  title: string;
  caption: string;
}

export interface CreateMessageType {
  severity: string;
  message?: string;
  timeToLive?: number;
  translationKey?: string;
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

export interface BrightcoveAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface H5POembed {
  height: number;
  width: number;
  html: string;
  type: string;
  version: string;
  title: string;
}

export interface License {
  license: string;
  description?: string;
  url?: string;
}

export interface ReduxState {
  images: ReduxImageState;
}

export type SearchType = typeof SearchTypeValues[number];

export type ConvertedDraftType = {
  language?: string;
  title?: string;
  introduction?: string;
  visualElement?: string;
  content?: string;
  metaDescription?: string;
  tags: string[];
  conceptIds: ConceptApiType[];
  relatedContent: (DraftApiType | RelatedContent)[];
  id?: number;
  oldNdlaUrl?: string | undefined;
  revision: number;
  status: DraftStatus;
  copyright?: Copyright | undefined;
  requiredLibraries: { mediaType: string; name: string; url: string }[];
  metaImage?: { id: string; alt: string } | null;
  created: string;
  updated: string;
  updatedBy: string;
  published: string;
  articleType: string;
  supportedLanguages: string[];
  notes: Note[];
  editorLabels: string[];
  grepCodes: string[];
  availability: AvailabilityType;
} & { taxonomy?: Partial<ArticleTaxonomy> };

export interface SlateArticle {
  articleType: string;
  content?: string;
  copyright: {
    license?: License;
    origin?: string;
    creators: Author[];
    processors: Author[];
    rightsholders: Author[];
  };
  id?: number;
  introduction?: string;
  language?: string;
  metaImage?: { id: string; alt: string | undefined } | null;
  metaDescription: string;
  notes: string[];
  published?: string;
  supportedLanguages: string[];
  tags: string[];
  title?: string;
  grepCodes: string[] | undefined;
  conceptIds?: ConceptApiType[];
  availability?: AvailabilityType;
  relatedContent: (DraftApiType | RelatedContent)[];
}
