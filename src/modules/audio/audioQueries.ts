/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  IAudioMetaInformation,
  IAudioSummarySearchResult,
  ISeriesSummarySearchResult,
  ISeries,
  ISeriesSearchParams,
  ISearchParams as IAudioSearchParams,
  ITagsSearchResult,
} from "@ndla/types-backend/audio-api";
import { fetchAudio, fetchSearchTags, fetchSeries, postSearchAudio, postSearchSeries } from "./audioApi";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { AUDIO, PODCAST_SERIES, SEARCH_AUDIO, AUDIO_SEARCH_TAGS, SEARCH_SERIES } from "../../queryKeys";

export interface UseAudio {
  id: number;
  language?: string;
}

export const audioQueryKeys = {
  audio: (params?: Partial<UseAudio>) => [AUDIO, params] as const,
  search: (params?: Partial<StringSort<IAudioSearchParams>>) => [SEARCH_AUDIO, params] as const,
  podcastSeries: (params?: Partial<UseSeries>) => [PODCAST_SERIES, params] as const,
  podcastSeriesSearch: (params?: Partial<StringSort<ISeriesSearchParams>>) => [SEARCH_SERIES, params] as const,
  audioSearchTags: (params?: Partial<UseSearchTags>) => [AUDIO_SEARCH_TAGS, params] as const,
};

export const useAudio = (params: UseAudio, options?: Partial<UseQueryOptions<IAudioMetaInformation>>) =>
  useQuery<IAudioMetaInformation>({
    queryKey: audioQueryKeys.audio(params),
    queryFn: () => fetchAudio(params.id, params.language),
    ...options,
  });

export interface UseSeries {
  id: number;
  language?: string;
}

export const useSeries = (params: UseSeries, options?: Partial<UseQueryOptions<ISeries>>) =>
  useQuery<ISeries>({
    queryKey: audioQueryKeys.podcastSeries(params),
    queryFn: () => fetchSeries(params.id, params.language),
    ...options,
  });

export const useSearchSeries = (
  query: StringSort<ISeriesSearchParams>,
  options?: Partial<UseQueryOptions<ISeriesSummarySearchResult>>,
) => {
  return useQuery<ISeriesSummarySearchResult>({
    queryKey: audioQueryKeys.podcastSeriesSearch(query),
    queryFn: () => postSearchSeries(query),
    ...options,
  });
};

export const useSearchAudio = (
  query: StringSort<IAudioSearchParams>,
  options?: Partial<UseQueryOptions<IAudioSummarySearchResult>>,
) => {
  return useQuery<IAudioSummarySearchResult>({
    queryKey: audioQueryKeys.search(query),
    queryFn: () => postSearchAudio(query),
    ...options,
  });
};

interface UseSearchTags {
  input: string;
  language: string;
}

export const useAudioSearchTags = (params: UseSearchTags, options?: Partial<UseQueryOptions<ITagsSearchResult>>) => {
  return useQuery<ITagsSearchResult>({
    queryKey: audioQueryKeys.audioSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
    ...options,
  });
};
