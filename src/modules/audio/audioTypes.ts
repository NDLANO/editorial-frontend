/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ISeriesDTO } from "@ndla/types-backend/audio-api";
import { Descendant } from "slate";
import { AudioFormikType } from "../../containers/AudioUploader/components/AudioForm";

export interface PostAudioTranscription {
  id: number;
  name: string;
  language: string;
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
