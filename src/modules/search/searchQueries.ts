import queryString from 'query-string';
import { useQuery, UseQueryOptions } from 'react-query';
import { SEARCH } from '../../queryKeys';
import { search } from './searchApi';
import { MultiSearchApiQuery, MultiSearchResult } from './searchApiInterfaces';

export const useSearch = (
  query: MultiSearchApiQuery,
  options?: UseQueryOptions<MultiSearchResult>,
) =>
  useQuery<MultiSearchResult>([SEARCH, queryString.stringify(query)], () => search(query), options);
