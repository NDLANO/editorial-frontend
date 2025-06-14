/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IAudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
import { IArticleDTO, IRelatedContentLinkDTO } from "@ndla/types-backend/draft-api";
import {
  AudioEmbedData,
  BrightcoveEmbedData,
  H5pEmbedData,
  IframeEmbedData,
  ImageEmbedData,
  OembedEmbedData,
} from "@ndla/types-embed";
import { SearchTypeValues, LOCALE_VALUES } from "./constants";
import { FormEvent } from "react";
import { DateChangedEvent } from "./containers/FormikForm/components/InlineDatePicker";

export interface FormikStatus {
  status?: string;
  warnings?: Record<string, string>;
}

export type NdlaError = {
  message?: string;
  severity: MessageSeverity;
  timeToLive: number;
};

// Should be a union of allowed status values generated by backend. Fix in the future.
export type DraftStatusType = string;
export type DraftStatusStateMachineType = Record<DraftStatusType, DraftStatusType[]>;

// Should be a union of allowed status values generated by backend. Fix in the future.
export type ConceptStatusType = string;
export type ConceptStatusStateMachineType = Record<ConceptStatusType, ConceptStatusType[]>;

export type LocaleType = (typeof LOCALE_VALUES)[number];

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export interface SearchResultBase<T> {
  totalCount: number;
  page?: number;
  pageSize: number;
  language?: string;
  results: T[];
}

export interface CodeBlockType {
  code: string;
  title: string;
  format: string;
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

export type TypeOfPreview = "preview" | "previewLanguageArticle" | "previewVersion" | "previewProductionArticle";

export type RelatedContent = IRelatedContentLinkDTO | number;

export type ConvertedRelatedContent = RelatedContent | IArticleDTO;

export type MessageSeverity = "danger" | "info" | "success" | "warning";

export interface H5pEmbed {
  resource: "h5p";
  path: string;
  url?: string;
  title?: string;
}

export interface ErrorEmbed {
  resource: "error";
  message: string;
}

export type Embed =
  | ImageEmbedData
  | BrightcoveEmbedData
  | AudioEmbedData
  | H5pEmbedData
  | ErrorEmbed
  | OembedEmbedData
  | IframeEmbedData;

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

export interface SlateAudio extends Omit<IAudioMetaInformationDTO, "title"> {
  title: string;
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

export type SearchType = (typeof SearchTypeValues)[number];

export interface ReturnType<TType, TReturnType> {
  type: TType;
  value: TReturnType;
}

export interface WithTaxonomyVersion {
  taxonomyVersion: string;
}

export interface WhitelistProvider {
  name: string;
  url: string[];
  height?: string;
}

export type Dictionary<T> = Record<string, T>;

interface BaseApiTranslateType {
  content: string | string[];
  type: "text" | "html";
  isArray: true | false;
}

interface ApiTranslateTypeSingle extends BaseApiTranslateType {
  content: string;
  isArray: false;
}

interface ApiTranslateTypeArray extends BaseApiTranslateType {
  content: string[];
  isArray: true;
}

export type ApiTranslateType = ApiTranslateTypeSingle | ApiTranslateTypeArray;

type FormEvents = FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement>;
type FieldChangedEvent = FormEvents | DateChangedEvent;

export type OnFieldChangeFunction = <T extends keyof SearchParams>(
  name: T,
  value: SearchParams[T],
  event?: FieldChangedEvent,
) => void;

export interface SearchParams {
  query?: string;
  "draft-status"?: string;
  "include-other-statuses"?: boolean;
  "resource-types"?: string;
  "article-types"?: string;
  "audio-type"?: string;
  fallback?: boolean;
  language?: string;
  page?: number;
  "page-size"?: number;
  status?: string;
  subjects?: string;
  users?: string;
  sort?: string;
  license?: string;
  "model-released"?: string;
  "revision-date-from"?: string;
  "revision-date-to"?: string;
  "exclude-revision-log"?: boolean | undefined;
  "responsible-ids"?: string;
  "concept-type"?: string;
  "filter-inactive"?: boolean;
  includeCopyrighted?: boolean;
}

export type PromptType = PromptVariables["type"];

export type PromptVariables =
  | SummaryVariables
  | AltTextVariables
  | AlternativePhrasingVariables
  | MetaDescriptionVariables
  | ReflectionVariables;

export interface SummaryVariables {
  type: "summary";
  text: string;
  title: string;
}

export interface AltTextVariables {
  type: "altText";
  image: {
    fileType: string;
    base64: string;
  };
}

export interface AlternativePhrasingVariables {
  type: "alternativePhrasing";
  html: string;
}

export interface MetaDescriptionVariables {
  type: "metaDescription";
  text: string;
  title: string;
}

export interface ReflectionVariables {
  type: "reflection";
  text: string;
}

const promptTypes: PromptType[] = [
  "summary",
  "altText",
  "alternativePhrasing",
  "metaDescription",
  "reflection",
] as const;

export const isPromptType = (type: any): type is PromptType => promptTypes.includes(type as PromptType);

export type PromptPayload<T extends PromptVariables> = T & {
  language: string;
  role?: string;
  instructions?: string;
  max_tokens?: number;
};

export interface DefaultPrompts {
  role: string;
  instructions: string;
}

export interface LlmResponse {
  fullResponse: string;
  answer: string;
}
