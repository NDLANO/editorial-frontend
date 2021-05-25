/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Copyright } from '../../interfaces';
import { AudioFormikType } from '../../containers/AudioUploader/components/AudioForm';

type AudioType = 'standard' | 'podcast';

export interface AudioFile {
  url: string;
  mimeType: string;
  fileSize: number;
  language: string;
}

export interface NewPodcastMeta {
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

export interface NewAudioMetaInformation {
  id?: number; // Only used by frontend, ignored by backend
  title: string;
  manuscript: string;
  language: string;
  copyright: Copyright;
  tags: string[];
  audioType: string;
  podcastMeta?: NewPodcastMeta;
}

export interface UpdatedAudioMetaInformation extends NewAudioMetaInformation {
  revision?: number;
}

export interface NewPodcastMetaInformation extends NewAudioMetaInformation {
  podcastMeta: NewPodcastMeta;
}

export interface UpdatedPodcastMetaInformation extends NewPodcastMetaInformation {
  revision?: number;
}

export interface AudioApiType {
  id: number;
  revision: number;
  title: {
    title: string;
    language: string;
  };
  manuscript: {
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
}

export interface PodcastFormValues extends Omit<AudioFormikType, 'language'> {
  language?: string;
  filepath: '';
  audioType?: 'podcast';
  introduction?: string;
  coverPhotoId?: string;
  metaImageAlt?: string;
  metaImageUrl?: string;
}

export interface AudioSearchResultType {
  id: number;
  title: { title: string; language: string };
  audioType: AudioType;
  url: string;
  supportedLanguages?: string[];
  license: string;
}

export interface FlattenedAudioApiType extends Omit<AudioApiType, 'title' | 'manuscript' | 'tags'> {
  title: string;
  manuscript: string;
  tags: string[];
  language?: string;
}

export interface SearchParams {
  'audio-type'?: string;
  'page-size'?: number;
  language?: string;
  page?: number;
  query?: string;
  sort?: string;
}

interface SearchResultBase<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  language: string;
  results: T[];
}

export type TagSearchResult = SearchResultBase<string>;
