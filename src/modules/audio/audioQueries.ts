/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  IAudioMetaInformation,
  IAudioSummarySearchResult,
  ISeriesSummarySearchResult,
  ISeries,
} from '@ndla/types-backend/audio-api';
import { fetchAudio, fetchSeries, searchAudio, searchSeries } from './audioApi';
import { AudioSearchParams, SeriesSearchParams } from './audioApiInterfaces';
import { AUDIO, PODCAST_SERIES, SEARCH_AUDIO, SEARCH_SERIES } from '../../queryKeys';

export interface UseAudio {
  id: number;
  language?: string;
}

export const audioQueryKeys = {
  audio: (params?: Partial<UseAudio>) => [AUDIO, params] as const,
  search: (params?: Partial<AudioSearchParams>) => [SEARCH_AUDIO, params] as const,
  podcastSeries: (params?: Partial<UseSeries>) => [PODCAST_SERIES, params] as const,
  podcastSeriesSearch: (params?: Partial<SeriesSearchParams>) => [SEARCH_SERIES, params] as const,
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
  query: SeriesSearchParams,
  options?: Partial<UseQueryOptions<ISeriesSummarySearchResult>>,
) =>
  useQuery<ISeriesSummarySearchResult>({
    queryKey: audioQueryKeys.podcastSeriesSearch(query),
    queryFn: () => searchSeries(query),
    ...options,
  });

export const useSearchAudio = (
  query: AudioSearchParams,
  options?: Partial<UseQueryOptions<IAudioSummarySearchResult>>,
) =>
  useQuery<IAudioSummarySearchResult>({
    queryKey: audioQueryKeys.search(query),
    queryFn: () => searchAudio(query),
    ...options,
  });
