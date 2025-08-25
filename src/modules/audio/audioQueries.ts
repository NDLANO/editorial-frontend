/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  IAudioMetaInformationDTO,
  IAudioSummarySearchResultDTO,
  ISeriesSummarySearchResultDTO,
  ISeriesDTO,
  ISeriesSearchParamsDTO,
  ISearchParamsDTO as IAudioSearchParams,
  ITagsSearchResultDTO,
  ITranscriptionResultDTO,
} from "@ndla/types-backend/audio-api";
import {
  fetchAudio,
  fetchAudioTranscription,
  fetchSearchTags,
  fetchSeries,
  postSearchAudio,
  postSearchSeries,
} from "./audioApi";
import {
  AUDIO,
  PODCAST_SERIES,
  SEARCH_AUDIO,
  AUDIO_SEARCH_TAGS,
  SEARCH_SERIES,
  AUDIO_TRANSCRIPTION,
} from "../../queryKeys";
import { UseAudio, UseSearchTags, UseSeries, UseTranscription } from "./audioTypes";
import { StringSort } from "../../interfaces";

export const audioQueryKeys = {
  audio: (params?: Partial<UseAudio>) => [AUDIO, params] as const,
  search: (params?: Partial<StringSort<IAudioSearchParams>>) => [SEARCH_AUDIO, params] as const,
  podcastSeries: (params?: Partial<UseSeries>) => [PODCAST_SERIES, params] as const,
  podcastSeriesSearch: (params?: Partial<StringSort<ISeriesSearchParamsDTO>>) => [SEARCH_SERIES, params] as const,
  audioSearchTags: (params?: Partial<UseSearchTags>) => [AUDIO_SEARCH_TAGS, params] as const,
  audioTranscription: (params?: Partial<UseTranscription>) => [AUDIO_TRANSCRIPTION, params] as const,
};

export const useAudio = (params: UseAudio, options?: Partial<UseQueryOptions<IAudioMetaInformationDTO>>) =>
  useQuery<IAudioMetaInformationDTO>({
    queryKey: audioQueryKeys.audio(params),
    queryFn: () => fetchAudio(params.id, params.language),
    ...options,
  });

export const useSeries = (params: UseSeries, options?: Partial<UseQueryOptions<ISeriesDTO>>) =>
  useQuery<ISeriesDTO>({
    queryKey: audioQueryKeys.podcastSeries(params),
    queryFn: () => fetchSeries(params.id, params.language),
    ...options,
  });

export const useSearchSeries = (
  query: StringSort<ISeriesSearchParamsDTO>,
  options?: Partial<UseQueryOptions<ISeriesSummarySearchResultDTO>>,
) => {
  return useQuery<ISeriesSummarySearchResultDTO>({
    queryKey: audioQueryKeys.podcastSeriesSearch(query),
    queryFn: () => postSearchSeries(query),
    ...options,
  });
};

export const useSearchAudio = (
  query: StringSort<IAudioSearchParams>,
  options?: Partial<UseQueryOptions<IAudioSummarySearchResultDTO>>,
) => {
  return useQuery<IAudioSummarySearchResultDTO>({
    queryKey: audioQueryKeys.search(query),
    queryFn: () => postSearchAudio(query),
    ...options,
  });
};

export const useAudioSearchTags = (params: UseSearchTags, options?: Partial<UseQueryOptions<ITagsSearchResultDTO>>) => {
  return useQuery<ITagsSearchResultDTO>({
    queryKey: audioQueryKeys.audioSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
    ...options,
  });
};

export const useAudioTranscription = (
  params: UseTranscription,
  options?: Partial<UseQueryOptions<ITranscriptionResultDTO>>,
) => {
  return useQuery<ITranscriptionResultDTO>({
    queryKey: audioQueryKeys.audioTranscription(params),
    queryFn: () => fetchAudioTranscription(params.audioId, params.language),
    ...options,
  });
};
