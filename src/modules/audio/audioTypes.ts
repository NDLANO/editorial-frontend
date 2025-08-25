/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IAudioDTO, IAuthorDTO, ISeriesDTO } from "@ndla/types-backend/audio-api";
import { Descendant } from "slate";

export interface PostAudioTranscription {
  id: number;
  name: string;
  language: string;
}

export interface AudioFormikType {
  id?: number;
  revision?: number;
  language: string;
  supportedLanguages: string[];
  title: Descendant[];
  manuscript: Descendant[];
  audioFile: {
    storedFile?: IAudioDTO;
    newFile?: {
      filepath: string;
      file: File;
    };
  };
  tags: string[];
  creators: IAuthorDTO[];
  processors: IAuthorDTO[];
  rightsholders: IAuthorDTO[];
  processed: boolean;
  origin: string;
  license: string;
}

export interface PodcastFormValues extends AudioFormikType {
  filepath: "";
  audioType?: "podcast";
  introduction: Descendant[];
  coverPhotoId?: string;
  metaImageAlt?: string;
  metaImageUrl?: string;
  series: ISeriesDTO | null;
  seriesId?: number;
}

export interface PodcastSeriesFormikType {
  id?: number;
  revision?: number;
  title: Descendant[];
  description: Descendant[];
  language: string;
  coverPhotoId?: string;
  metaImageAlt?: string;
  episodes: number[];
  supportedLanguages: string[];
  hasRSS?: boolean;
}

export interface UseSeries {
  id: number;
  language?: string;
}

export interface UseAudio {
  id: number;
  language?: string;
}

export interface UseTranscription {
  audioId: number;
  language: string;
}

export interface UseSearchTags {
  input: string;
  language: string;
}
