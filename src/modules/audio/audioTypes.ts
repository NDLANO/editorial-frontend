/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AudioDTO, AuthorDTO, SeriesDTO } from "@ndla/types-backend/audio-api";
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
    storedFile?: AudioDTO;
    newFile?: {
      filepath: string;
      file: File;
    };
  };
  tags: string[];
  creators: AuthorDTO[];
  processors: AuthorDTO[];
  rightsholders: AuthorDTO[];
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
  series: SeriesDTO | null;
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
