/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
