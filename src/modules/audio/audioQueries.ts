/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
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
  postAudioTranscription,
  postSearchAudio,
  postSearchSeries,
} from "./audioApi";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import {
  AUDIO,
  PODCAST_SERIES,
  SEARCH_AUDIO,
  AUDIO_SEARCH_TAGS,
  SEARCH_SERIES,
  AUDIO_TRANSCRIPTION,
} from "../../queryKeys";

export interface UseAudio {
  id: number;
  language?: string;
}

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

export interface UseSeries {
  id: number;
  language?: string;
}

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

interface UseSearchTags {
  input: string;
  language: string;
}

export const useAudioSearchTags = (params: UseSearchTags, options?: Partial<UseQueryOptions<ITagsSearchResultDTO>>) => {
  return useQuery<ITagsSearchResultDTO>({
    queryKey: audioQueryKeys.audioSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
    ...options,
  });
};

interface UseTranscription {
  audioId: number;
  language: string;
}

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

interface PostAudioTranscription {
  id: number;
  name: string;
  language: string;
}

export const usePostTranscription = (options?: Partial<UseMutationOptions<void, any, PostAudioTranscription>>) => {
  return useMutation<void, any, PostAudioTranscription>({
    mutationFn: (params) => postAudioTranscription(params.name, params.id, params.language),
    ...options,
  });
};
