/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import queryString from 'query-string';
import { SEARCH_AUDIO, SEARCH_SERIES } from '../../queryKeys';
import { AudioSearchResult, SeriesSearchParams, SeriesSearchResult } from './audioApiInterfaces';
import { searchAudio, searchSeries } from './audioApi';

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
