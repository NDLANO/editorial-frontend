/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useQuery, UseQueryOptions } from 'react-query';
import { IMAGE, SEARCH_IMAGES } from '../../queryKeys';
import { fetchImage, searchImages } from './imageApi';
import { ImageApiType, ImageSearchQuery, ImageSearchResult } from './imageApiInterfaces';

export const useImage = (
  id: string | number,
  language: string | undefined,
  options?: UseQueryOptions<ImageApiType>,
) => useQuery<ImageApiType>([IMAGE, id, language], () => fetchImage(id, language), options);

export const useSearchImages = (
  query: ImageSearchQuery,
  options?: UseQueryOptions<ImageSearchResult>,
) =>
  useQuery<ImageSearchResult>(
    [SEARCH_IMAGES, queryString.stringify(query)],
    () => searchImages(query),
    options,
  );
