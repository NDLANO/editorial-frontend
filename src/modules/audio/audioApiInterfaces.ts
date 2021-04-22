/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Author, Copyright } from '../../interfaces';

type AudioType = 'standard' | 'podcast';

export interface AudioFile {
  url: string;
  mimeType: string;
  fileSize: number;
  language: string;
}

export interface NewPodcastMeta {
  header: string;
  introduction: string;
  coverPhotoId: string;
  coverPhotoAltText: string;
  manuscript: string;
}

export interface PodcastMeta {
  header: string;
  introduction: string;
  coverPhoto: {
    id: string;
    url: string;
    altText: string;
  };
  manuscript: string;
  language: string;
}

export interface NewAudioMetaInformation {
  id?: number; // Only used by frontend, ignored by backend
  title: string;
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

export interface PodcastFormValues {
  // TODO should extend AudioFormikType
  id?: number;
  revision?: number;
  language?: string;
  supportedLanguages?: string[];
  title?: string;
  audioFile: {
    storedFile?: {
      url: string;
      mimeType: string;
      fileSize: number;
      language: string;
    };
    newFile?: {
      filepath: string;
      file: File;
    };
  };
  filepath: '';
  tags?: string[];
  origin?: string;
  creators?: Author[];
  processors?: Author[];
  rightsholders?: Author[];
  license?: string;
  audioType?: 'podcast';
  header?: string;
  introduction?: string;
  coverPhotoId?: string;
  metaImageAlt?: string;
  metaImageUrl?: string;
  manuscript?: string;
}

export interface AudioSearchResultType {
  id: number;
  title: { title: string; language: string };
  audioType: AudioType;
  url: string;
  supportedLanguages?: string[];
  license: string;
}

export interface FlattenedAudioApiType extends Omit<AudioApiType, 'title' | 'tags'> {
  title: string;
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
