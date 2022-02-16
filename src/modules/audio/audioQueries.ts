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
  IAudioMetaInformation as AudioApiType,
  IAudioSummarySearchResult as AudioSearchResult,
  ISeriesSummarySearchResult as SeriesSearchResult,
  ISeries as PodcastSeriesApiType,
} from '@ndla/types-audio-api';
import { AUDIO, PODCAST_SERIES, SEARCH_AUDIO, SEARCH_SERIES } from '../../queryKeys';
import { SeriesSearchParams } from './audioApiInterfaces';
import { fetchAudio, fetchSeries, searchAudio, searchSeries } from './audioApi';

export const useAudio = (
  id: string | number,
  language: string | undefined,
  options?: UseQueryOptions<AudioApiType>,
) => useQuery<AudioApiType>([AUDIO, id, language], () => fetchAudio(id, language), options);

export const useSeries = (
  id: string | number,
  language: string | undefined,
  options?: UseQueryOptions<PodcastSeriesApiType>,
) =>
  useQuery<PodcastSeriesApiType>(
    [PODCAST_SERIES, id, language],
    () => fetchSeries(id, language),
    options,
  );

export const useSearchSeries = (
  query: SeriesSearchParams,
  options?: UseQueryOptions<SeriesSearchResult>,
) =>
  useQuery<SeriesSearchResult>(
    [SEARCH_SERIES, queryString.stringify(query)],
    () => searchSeries(query),
    options,
  );

export const useSearchAudio = (query: object, options?: UseQueryOptions<AudioSearchResult>) =>
  useQuery<AudioSearchResult>(
    [SEARCH_AUDIO, queryString.stringify(query)],
    () => searchAudio(query),
    options,
  );
