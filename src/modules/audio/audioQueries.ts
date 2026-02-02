/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  AudioMetaInformationDTO,
  AudioSummarySearchResultDTO,
  SeriesSummarySearchResultDTO,
  SeriesDTO,
  SeriesSearchParamsDTO,
  SearchParamsDTO as AudioSearchParams,
  TagsSearchResultDTO,
  TranscriptionResultDTO,
} from "@ndla/types-backend/audio-api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
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

export const useAudio = (params: UseAudio, options?: Partial<UseQueryOptions<AudioMetaInformationDTO>>) =>
  useQuery<AudioMetaInformationDTO>({
    queryKey: audioQueryKeys.audio(params),
    queryFn: () => fetchAudio(params.id, params.language),
    ...options,
  });

export const useSeries = (params: UseSeries, options?: Partial<UseQueryOptions<SeriesDTO>>) =>
  useQuery<SeriesDTO>({
    queryKey: audioQueryKeys.podcastSeries(params),
    queryFn: () => fetchSeries(params.id, params.language),
    ...options,
  });

export const useSearchSeries = (
  query: SeriesSearchParamsDTO,
  options?: Partial<UseQueryOptions<SeriesSummarySearchResultDTO>>,
) => {
  return useQuery<SeriesSummarySearchResultDTO>({
    queryKey: audioQueryKeys.podcastSeriesSearch(query),
    queryFn: () => postSearchSeries(query),
    ...options,
  });
};

export const useSearchAudio = (
  query: AudioSearchParams,
  options?: Partial<UseQueryOptions<AudioSummarySearchResultDTO>>,
) => {
  return useQuery<AudioSummarySearchResultDTO>({
    queryKey: audioQueryKeys.search(query),
    queryFn: () => postSearchAudio(query),
    ...options,
  });
};

export const useAudioSearchTags = (params: UseSearchTags, options?: Partial<UseQueryOptions<TagsSearchResultDTO>>) => {
  return useQuery<TagsSearchResultDTO>({
    queryKey: audioQueryKeys.audioSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
    ...options,
  });
};

export const useAudioTranscription = (
  params: UseTranscription,
  options?: Partial<UseQueryOptions<TranscriptionResultDTO>>,
) => {
  return useQuery<TranscriptionResultDTO>({
    queryKey: audioQueryKeys.audioTranscription(params),
    queryFn: () => fetchAudioTranscription(params.audioId, params.language),
    ...options,
  });
};
