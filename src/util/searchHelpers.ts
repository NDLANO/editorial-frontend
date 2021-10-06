/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UseQueryResult } from 'react-query';
import { SearchResultBase, SearchType } from '../interfaces';
import { useSearchAudio, useSearchSeries } from '../modules/audio/audioQueries';
import { useSearchConcepts } from '../modules/concept/conceptQueries';
import { useSearchImages } from '../modules/image/imageQueries';
import { useSearch } from '../modules/search/searchQueries';

export const transformQuery = ({ 'resource-types': resourceTypes, ...rest }: any) => {
  const query = { ...rest };

  if (resourceTypes === 'topic-article') {
    query['context-types'] = resourceTypes;
  } else if (resourceTypes) {
    query['resource-types'] = resourceTypes;
  }

  return query;
};

type SearchHookType = (query: any) => UseQueryResult<SearchResultBase<any>>;

export const getSearchHookFromType = (type: SearchType): SearchHookType =>
  searchTypeToHookMapping[type] ?? useSearch;

const searchTypeToHookMapping: Record<SearchType, SearchHookType> = {
  audio: useSearchAudio,
  concept: useSearchConcepts,
  image: useSearchImages,
  'podcast-series': useSearchSeries,
  content: useSearch,
};
