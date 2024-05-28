/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  ISearchResultV3,
  ISearchParams,
  IImageMetaInformationV3,
  ISearchParams as IImageSearchParams,
} from "@ndla/types-backend/image-api";
import { fetchImage, postSearchImages } from "./imageApi";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { IMAGE, SEARCH_IMAGES } from "../../queryKeys";

export interface UseImage {
  id: number;
  language?: string;
}

export const imageQueryKeys = {
  image: (params?: Partial<UseImage>) => [IMAGE, params] as const,
  search: (params?: Partial<StringSort<ISearchParams>>) => [SEARCH_IMAGES, params] as const,
};

export const useImage = (params: UseImage, options?: Partial<UseQueryOptions<IImageMetaInformationV3>>) =>
  useQuery<IImageMetaInformationV3>({
    queryKey: imageQueryKeys.image(params),
    queryFn: () => fetchImage(params.id, params.language),
    ...options,
  });

export const useSearchImages = (
  query: StringSort<IImageSearchParams>,
  options?: Partial<UseQueryOptions<ISearchResultV3>>,
) => {
  return useQuery<ISearchResultV3>({
    queryKey: imageQueryKeys.search(query),
    queryFn: () => postSearchImages(query),
    ...options,
  });
};
