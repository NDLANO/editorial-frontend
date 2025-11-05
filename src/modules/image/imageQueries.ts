/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  SearchResultV3DTO,
  SearchParamsDTO,
  ImageMetaInformationV3DTO,
  SearchParamsDTO as IImageSearchParams,
  TagsSearchResultDTO,
} from "@ndla/types-backend/image-api";
import { fetchImage, fetchSearchTags, postSearchImages } from "./imageApi";
import { IMAGE, IMAGE_SEARCH_TAGS, SEARCH_IMAGES } from "../../queryKeys";
import { StringSort } from "../../interfaces";

export interface UseImage {
  id: number;
  language?: string;
}

export const imageQueryKeys = {
  image: (params?: Partial<UseImage>) => [IMAGE, params] as const,
  search: (params?: Partial<StringSort<SearchParamsDTO>>) => [SEARCH_IMAGES, params] as const,
  imageSearchTags: (params?: Partial<UseSearchTags>) => [IMAGE_SEARCH_TAGS, params] as const,
};

export const useImage = (params: UseImage, options?: Partial<UseQueryOptions<ImageMetaInformationV3DTO>>) =>
  useQuery<ImageMetaInformationV3DTO>({
    queryKey: imageQueryKeys.image(params),
    queryFn: () => fetchImage(params.id, params.language),
    ...options,
  });

export const useSearchImages = (
  query: StringSort<IImageSearchParams>,
  options?: Partial<UseQueryOptions<SearchResultV3DTO>>,
) => {
  return useQuery<SearchResultV3DTO>({
    queryKey: imageQueryKeys.search(query),
    queryFn: () => postSearchImages(query),
    ...options,
  });
};

interface UseSearchTags {
  input: string;
  language: string;
}

export const useImageSearchTags = (params: UseSearchTags, options?: Partial<UseQueryOptions<TagsSearchResultDTO>>) => {
  return useQuery<TagsSearchResultDTO>({
    queryKey: imageQueryKeys.imageSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
    ...options,
  });
};
