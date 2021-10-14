/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SearchResultBase, SearchType } from '../interfaces';
import { searchAudio, searchSeries } from '../modules/audio/audioApi';
import { searchConcepts } from '../modules/concept/conceptApi';
import { searchImages } from '../modules/image/imageApi';
import { search } from '../modules/search/searchApi';

export const transformQuery = ({ 'resource-types': resourceTypes, ...rest }: any) => {
  const query = { ...rest };

  if (resourceTypes === 'topic-article') {
    query['context-types'] = resourceTypes;
  } else if (resourceTypes) {
    query['resource-types'] = resourceTypes;
  }

  return query;
};

type SearchFunctionType = (query: any) => Promise<SearchResultBase<any>>;

export const getSearchFunctionFromType = (type: SearchType): SearchFunctionType => {
  return searchTypeToFunctionMapping[type] ?? search;
};

const searchTypeToFunctionMapping: Record<SearchType, SearchFunctionType> = {
  audio: searchAudio,
  concept: searchConcepts,
  image: searchImages,
  'podcast-series': searchSeries,
  content: search,
};
