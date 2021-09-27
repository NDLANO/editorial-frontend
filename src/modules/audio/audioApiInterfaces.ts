/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Copyright, SearchResultBase } from '../../interfaces';
import { AudioFormikType } from '../../containers/AudioUploader/components/AudioForm';

type AudioType = 'standard' | 'podcast';

export interface AudioFile {
  url: string;
  mimeType: string;
  fileSize: number;
  language: string;
}

export interface PodcastMetaPost {
  introduction: string;
  coverPhotoId: string;
  coverPhotoAltText: string;
}

export interface PodcastMeta {
  introduction: string;
  coverPhoto: {
    id: string;
    url: string;
    altText: string;
  };
  language: string;
}

export interface AudioMetaInformationPost {
  id?: number; // Only used by frontend, ignored by backend
  title: string;
  manuscript?: string;
  language: string;
  copyright: Copyright;
  tags: string[];
  audioType?: string;
  podcastMeta?: PodcastMetaPost;
  seriesId?: number;
}

export interface AudioMetaInformationPut extends AudioMetaInformationPost {
  revision?: number;
}

export interface PodcastMetaInformationPost extends AudioMetaInformationPost {
  podcastMeta: PodcastMetaPost;
}

export interface PodcastMetaInformationPut extends PodcastMetaInformationPost {
  revision?: number;
}

export interface AudioApiType {
  id: number;
  revision: number;
  title: {
    title: string;
    language: string;
  };
  manuscript?: {
    manuscript: string;
    language: string;
  };
  audioFile: AudioFile;
  copyright: Copyright;
  tags: {
    tags: string[];
    language: string;
  };
  supportedLanguages: string[];
  audioType: AudioType;
  podcastMeta?: PodcastMeta;
  series?: PodcastSeriesApiType;
  created: string;
  updated: string;
}

export interface PodcastFormValues extends AudioFormikType {
  filepath: '';
  audioType?: 'podcast';
  introduction?: string;
  coverPhotoId?: string;
  metaImageAlt?: string;
  metaImageUrl?: string;
  series: PodcastSeriesApiType | null;
  seriesId?: number;
}

export interface AudioSearchResultType {
  id: number;
  title: { title: string; language: string };
  audioType: AudioType;
  url: string;
  supportedLanguages?: string[];
  license: string;
  podcastMeta?: PodcastMeta;
  series?: {
    id: number;
    title: {
      title: string;
      language: string;
    };
    supportedLanguages: string[];
    coverPhoto: {
      id: string;
      url: string;
      altText: string;
    };
  };
}

export interface AudioSearchParams {
  'audio-type'?: string;
  'page-size'?: number;
  language?: string;
  page?: number;
  query?: string;
  sort?: string;
}

export interface PodcastSeriesApiType {
  id: number;
  revision: number;
  title: { title: string; language: string };
  description: { description: string; language: string };
  coverPhoto: { id: string; altText: string; url: string };
  episodes?: AudioApiType[];
  supportedLanguages: string[];
}

export interface PodcastSeriesPost {
  id?: number;
  title: string;
  description: string;
  revision?: number;
  coverPhotoId: string;
  coverPhotoAltText: string;
  episodes: number[];
  language: string;
}

export type PodcastSeriesPut = PodcastSeriesPost;

export interface SeriesSearchParams {
  query?: string;
  page?: number;
  'page-size'?: number;
  language?: string;
}

export interface SeriesSearchResultType {
  id: number;
  title: {
    title: string;
    language: string;
  };
  description: {
    description: string;
    language: string;
  };
  supportedLanguages: string[];
  episodes: AudioSearchResultType[];
  coverPhoto: {
    id: string;
    url: string;
    altText: string;
  };
}

export type AudioSearchResult = SearchResultBase<AudioSearchResultType>;
export type SeriesSearchResult = SearchResultBase<SeriesSearchResultType>;
export type TagSearchResult = SearchResultBase<string>;
