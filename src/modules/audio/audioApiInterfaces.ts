/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Copyright } from '../../interfaces';

type AudioType = 'standard' | 'podcast';

export interface NewPodcastMeta {
  header: string;
  introduction: string;
  coverPhotoId: string;
  coverPhotoAltText: string;
  manuscript: string;
}

interface NewAudioMetaInformation {
  title: string;
  language: string;
  copyright: Copyright;
  tags: string[];
  audioType: AudioType;
}

export interface NewPodcastMetaInformation extends NewAudioMetaInformation {
  audioType: 'podcast';
  podcastMeta: NewPodcastMeta;
}
