import queryString from 'query-string';
import { useQuery, UseQueryOptions } from 'react-query';
import { SEARCH_IMAGES } from '../../queryKeys';
import { searchImages } from './imageApi';
import { ImageSearchQuery, ImageSearchResult } from './imageApiInterfaces';

export const useSearchImages = (
  query: ImageSearchQuery,
  options?: UseQueryOptions<ImageSearchResult>,
) =>
  useQuery<ImageSearchResult>(
    [SEARCH_IMAGES, queryString.stringify(query)],
    () => searchImages(query),
    options,
  );
