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

export interface NewAudioMetaInformation {
  id?: number; // Only used by frontend, ignored by backend
  title: string;
  language: string;
  copyright: Copyright;
  tags: string[];
  audioType: AudioType;
  podcastMeta?: NewPodcastMeta;
}

export interface UpdatedAudioMetaInformation extends NewAudioMetaInformation {
  revision: number;
}

export interface NewPodcastMetaInformation extends NewAudioMetaInformation {
  audioType: 'podcast';
  podcastMeta: NewPodcastMeta;
}

export interface UpdatedPodcastMetaInformation extends NewPodcastMetaInformation {
  revision: number;
}

export interface ApiPodcastMetaType {
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

export interface ApiAudioType {
  id: number;
  revision: number;
  title: string;
  audioFile: AudioFile;
  copyright: Copyright;
  tags: {
    language: string;
    tags: string[];
  };
  supportedLanguages: string[];
  audioType: AudioType;
  podcastMeta?: ApiPodcastMetaType;
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
