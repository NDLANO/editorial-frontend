/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ISearchResult, ISearchParams, IImageMetaInformationV2 } from '@ndla/types-image-api';
import queryString from 'query-string';
import { useQuery, UseQueryOptions } from 'react-query';
import { IMAGE, SEARCH_IMAGES } from '../../queryKeys';
import { fetchImage, searchImages } from './imageApi';

export const useImage = (
  id: string | number,
  language: string | undefined,
  options?: UseQueryOptions<IImageMetaInformationV2>,
) =>
  useQuery<IImageMetaInformationV2>([IMAGE, id, language], () => fetchImage(id, language), options);

export const useSearchImages = (query: ISearchParams, options?: UseQueryOptions<ISearchResult>) =>
  useQuery<ISearchResult>(
    [SEARCH_IMAGES, queryString.stringify(query)],
    () => searchImages(query),
    options,
  );
