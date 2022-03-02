/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import { IAudioMetaInformation as AudioApiType } from '@ndla/types-audio-api';
import { IArticle, IRelatedContentLink } from '@ndla/types-draft-api';
import { SearchTypeValues, LOCALE_VALUES } from './constants';

export interface FormikStatus {
  status?: string;
  warnings?: Record<string, string>;
}

export type LocaleType = typeof LOCALE_VALUES[number];

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type AvailabilityType = 'everyone' | 'teacher' | string;

export type EditMode =
  | 'changeSubjectName'
  | 'deleteTopic'
  | 'addExistingSubjectTopic'
  | 'openCustomFields'
  | 'toggleMetadataVisibility'
  | 'editGrepCodes'
  | 'addExistingTopic'
  | 'addTopic'
  | 'deleteSubject'
  | '';

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

export interface Note {
  note: string;
  user: string;
  status: {
    current: string;
    other: string[];
  };
  timestamp: string;
}

export interface CodeBlockType {
  code: string;
  title: string;
  format: string;
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

export interface Auth0UserData {
  app_metadata: {
    ndla_id: string;
  };
  name: string;
}

export interface ZendeskToken {
  token: string;
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

export type RelatedContent = IRelatedContentLink | number;

export type ConvertedRelatedContent = RelatedContent | IArticle;

export type MessageSeverity = 'danger' | 'info' | 'success' | 'warning';
export interface ImageEmbed {
  resource: 'image';

  resource_id: string;
  size?: string;
  align?: string;
  alt: string;
  caption?: string;
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
  url?: string;
  account: string;
  player: string;
  title: string;
  metaData?: any;
}

export interface AudioEmbed {
  resource: 'audio';
  resource_id: string;
  type: string;
  url: string;
}

export interface H5pEmbed {
  resource: 'h5p';
  path: string;
  url?: string;
  title?: string;
}

export interface ExternalEmbed {
  resource: 'external' | 'iframe';
  url: string;
  metaData?: any;
  caption?: string;
  title?: string;
  height?: string;
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
}

export interface FormikInputEvent {
  preventDefault: Function;
  target: {
    value: string;
    name: string;
  };
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
  providerName?: string;
  version: string;
  title: string;
}

export type SearchType = typeof SearchTypeValues[number];
