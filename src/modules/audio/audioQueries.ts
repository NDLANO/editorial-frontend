/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import queryString from 'query-string';
import {
  IAudioMetaInformation,
  IAudioSummarySearchResult,
  ISeriesSummarySearchResult,
  ISeries,
} from '@ndla/types-audio-api';
import { AUDIO, PODCAST_SERIES, SEARCH_AUDIO, SEARCH_SERIES } from '../../queryKeys';
import { SeriesSearchParams } from './audioApiInterfaces';
import { fetchAudio, fetchSeries, searchAudio, searchSeries } from './audioApi';

export const useAudio = (
  id: number,
  language: string | undefined,
  options?: UseQueryOptions<IAudioMetaInformation>,
) =>
  useQuery<IAudioMetaInformation>([AUDIO, id, language], () => fetchAudio(id, language), options);

export const useSeries = (
  id: string | number,
  language: string | undefined,
  options?: UseQueryOptions<ISeries>,
) => useQuery<ISeries>([PODCAST_SERIES, id, language], () => fetchSeries(id, language), options);

export const useSearchSeries = (
  query: SeriesSearchParams,
  options?: UseQueryOptions<ISeriesSummarySearchResult>,
) =>
  useQuery<ISeriesSummarySearchResult>(
    [SEARCH_SERIES, queryString.stringify(query)],
    () => searchSeries(query),
    options,
  );

export const useSearchAudio = (
  query: object,
  options?: UseQueryOptions<IAudioSummarySearchResult>,
) =>
  useQuery<IAudioSummarySearchResult>(
    [SEARCH_AUDIO, queryString.stringify(query)],
    () => searchAudio(query),
    options,
  );
