/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import { ISeries as PodcastSeriesApiType } from '@ndla/types-audio-api';
import { Copyright, SearchResultBase } from '../../interfaces';
import { AudioFormikType } from '../../containers/AudioUploader/components/AudioForm';

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

export interface PodcastFormValues extends AudioFormikType {
  filepath: '';
  audioType?: 'podcast';
  introduction: Descendant[];
  coverPhotoId?: string;
  metaImageAlt?: string;
  metaImageUrl?: string;
  series: PodcastSeriesApiType | null;
  seriesId?: number;
}

export interface AudioSearchParams {
  'audio-type'?: string;
  'page-size'?: number;
  language?: string;
  page?: number;
  query?: string;
  sort?: string;
}

export interface SeriesSearchParams {
  query?: string;
  page?: number;
  'page-size'?: number;
  language?: string;
}

export type TagSearchResult = SearchResultBase<string>;
