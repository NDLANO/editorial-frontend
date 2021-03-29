/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Author, Copyright } from '../../interfaces';

type AudioType = 'standard' | 'podcast';

export interface NewPodcastMeta {
  header: string;
  introduction: string;
  coverPhotoId: string;
  coverPhotoAltText: string;
  manuscript: string;
  language: string;
}

export interface NewAudioMetaInformation {
  id?: number; // Used only to check if image was newly created. This id is discarded by backend. TODO
  title: string;
  language: string;
  copyright: Copyright;
  tags: string[];
  audioType: AudioType;
  podcastMeta?: NewPodcastMeta;
}

export interface NewPodcastMetaInformation extends NewAudioMetaInformation {
  audioType: 'podcast';
  podcastMeta: NewPodcastMeta;
}

export interface PodcastFormValues {
  id?: number;
  revision?: number;
  language?: string;
  supportedLanguages?: string[];
  title?: string;
  audioFile: any; // TODO FIX - AudioFile, string?
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
  // TODO add url
  manuscript?: string;
}
