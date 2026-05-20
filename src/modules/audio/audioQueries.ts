/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SeriesSearchParamsDTO, SearchParamsDTO as AudioSearchParams } from "@ndla/types-backend/audio-api";
import { queryOptions } from "@tanstack/react-query";
import {
  AUDIO,
  PODCAST_SERIES,
  SEARCH_AUDIO,
  AUDIO_SEARCH_TAGS,
  SEARCH_SERIES,
  AUDIO_TRANSCRIPTION,
} from "../../queryKeys";
import {
  fetchAudio,
  fetchAudioTranscription,
  fetchSearchTags,
  fetchSeries,
  postSearchAudio,
  postSearchSeries,
} from "./audioApi";
import { UseAudio, UseSearchTags, UseSeries, UseTranscription } from "./audioTypes";

export const audioQueryKeys = {
  audio: (params?: Partial<UseAudio>) => [AUDIO, params] as const,
  search: (params?: Partial<AudioSearchParams>) => [SEARCH_AUDIO, params] as const,
  podcastSeries: (params?: Partial<UseSeries>) => [PODCAST_SERIES, params] as const,
  podcastSeriesSearch: (params?: Partial<SeriesSearchParamsDTO>) => [SEARCH_SERIES, params] as const,
  audioSearchTags: (params?: Partial<UseSearchTags>) => [AUDIO_SEARCH_TAGS, params] as const,
  audioTranscription: (params?: Partial<UseTranscription>) => [AUDIO_TRANSCRIPTION, params] as const,
};

export const audioQueryOptions = (params: UseAudio) => {
  return queryOptions({
    queryKey: audioQueryKeys.audio(params),
    queryFn: () => fetchAudio(params.id, params.language),
  });
};

export const seriesQueryOptions = (params: UseSeries) => {
  return queryOptions({
    queryKey: audioQueryKeys.podcastSeries(params),
    queryFn: () => fetchSeries(params.id, params.language),
  });
};

export const searchSeriesQueryOptions = (params: SeriesSearchParamsDTO) => {
  return queryOptions({
    queryKey: audioQueryKeys.podcastSeriesSearch(params),
    queryFn: () => postSearchSeries(params),
  });
};

export const searchAudioQueryOptions = (params: AudioSearchParams) => {
  return queryOptions({
    queryKey: audioQueryKeys.search(params),
    queryFn: () => postSearchAudio(params),
  });
};

export const audioSearchTagsQueryOptions = (params: UseSearchTags) => {
  return queryOptions({
    queryKey: audioQueryKeys.audioSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
  });
};

export const audioTranscriptionQueryOptions = (params: UseTranscription) => {
  return queryOptions({
    queryKey: audioQueryKeys.audioTranscription(params),
    queryFn: () => fetchAudioTranscription(params.audioId, params.language),
  });
};
