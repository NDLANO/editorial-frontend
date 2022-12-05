/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ISearchResultV3, ISearchParams, IImageMetaInformationV3 } from '@ndla/types-image-api';
import { useQuery, UseQueryOptions } from 'react-query';
import { IMAGE, SEARCH_IMAGES } from '../../queryKeys';
import { fetchImage, searchImages } from './imageApi';

export interface UseImage {
  id: number;
  language?: string;
}

export const imageQueryKey = (params?: Partial<UseImage>) => [IMAGE, params];
export const useImage = (params: UseImage, options?: UseQueryOptions<IImageMetaInformationV3>) =>
  useQuery<IImageMetaInformationV3>(
    imageQueryKey(params),
    () => fetchImage(params.id, params.language),
    options,
  );

export const searchImagesQueryKey = (params?: Partial<ISearchParams>) => [SEARCH_IMAGES, params];

export const useSearchImages = (query: ISearchParams, options?: UseQueryOptions<ISearchResultV3>) =>
  useQuery<ISearchResultV3>(searchImagesQueryKey(query), () => searchImages(query), options);
