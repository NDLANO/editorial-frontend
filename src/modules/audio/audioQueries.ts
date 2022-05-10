/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import {
  IAudioMetaInformation,
  IAudioSummarySearchResult,
  ISeriesSummarySearchResult,
  ISeries,
} from '@ndla/types-audio-api';
import { AUDIO, PODCAST_SERIES, SEARCH_AUDIO, SEARCH_SERIES } from '../../queryKeys';
import { AudioSearchParams, SeriesSearchParams } from './audioApiInterfaces';
import { fetchAudio, fetchSeries, searchAudio, searchSeries } from './audioApi';

export interface UseAudio {
  id: number;
  language?: string;
}

export const audioQueryKeys = (params?: Partial<UseAudio>) => [AUDIO, params];

export const useAudio = (params: UseAudio, options?: UseQueryOptions<IAudioMetaInformation>) =>
  useQuery<IAudioMetaInformation>(
    audioQueryKeys(params),
    () => fetchAudio(params.id, params.language),
    options,
  );

export interface UseSeries {
  id: number;
  language?: string;
}

export const seriesQueryKey = (params?: Partial<UseSeries>) => [PODCAST_SERIES, params];

export const useSeries = (params: UseSeries, options?: UseQueryOptions<ISeries>) =>
  useQuery<ISeries>(seriesQueryKey(params), () => fetchSeries(params.id, params.language), options);

export const searchSeriesQueryKey = (params?: Partial<SeriesSearchParams>) => [
  SEARCH_SERIES,
  params,
];
export const useSearchSeries = (
  query: SeriesSearchParams,
  options?: UseQueryOptions<ISeriesSummarySearchResult>,
) =>
  useQuery<ISeriesSummarySearchResult>(
    searchSeriesQueryKey(query),
    () => searchSeries(query),
    options,
  );

export const searchAudioQueryKey = (params?: Partial<AudioSearchParams>) => [SEARCH_AUDIO, params];
export const useSearchAudio = (
  query: AudioSearchParams,
  options?: UseQueryOptions<IAudioSummarySearchResult>,
) =>
  useQuery<IAudioSummarySearchResult>(
    searchAudioQueryKey(query),
    () => searchAudio(query),
    options,
  );
