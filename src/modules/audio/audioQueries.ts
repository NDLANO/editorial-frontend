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
import { AUDIO, PODCAST_SERIES, SEARCH_AUDIO, SEARCH_SERIES } from '../../queryKeys';
import { AudioSearchParams, SeriesSearchParams } from './audioApiInterfaces';
import { fetchAudio, fetchSeries, searchAudio, searchSeries } from './audioApi';

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

export const useAudio = (params: UseAudio, options?: UseQueryOptions<IAudioMetaInformation>) =>
  useQuery<IAudioMetaInformation>(
    audioQueryKeys.audio(params),
    () => fetchAudio(params.id, params.language),
    options,
  );

export interface UseSeries {
  id: number;
  language?: string;
}

export const useSeries = (params: UseSeries, options?: UseQueryOptions<ISeries>) =>
  useQuery<ISeries>(
    audioQueryKeys.podcastSeries(params),
    () => fetchSeries(params.id, params.language),
    options,
  );

export const useSearchSeries = (
  query: SeriesSearchParams,
  options?: UseQueryOptions<ISeriesSummarySearchResult>,
) =>
  useQuery<ISeriesSummarySearchResult>(
    audioQueryKeys.podcastSeriesSearch(query),
    () => searchSeries(query),
    options,
  );

export const useSearchAudio = (
  query: AudioSearchParams,
  options?: UseQueryOptions<IAudioSummarySearchResult>,
) =>
  useQuery<IAudioSummarySearchResult>(
    audioQueryKeys.search(query),
    () => searchAudio(query),
    options,
  );
