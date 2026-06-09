/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SearchParamsDTO } from "@ndla/types-backend/image-api";
import { queryOptions } from "@tanstack/react-query";
import { IMAGE, IMAGE_EDITORS, IMAGE_SEARCH_TAGS, SEARCH_IMAGES } from "../../queryKeys";
import { fetchImage, fetchImageEditors, fetchSearchTags, postSearchImages } from "./imageApi";

export interface UseImage {
  id: number;
  language?: string;
}

export const imageQueryKeys = {
  image: (params?: Partial<UseImage>) => [IMAGE, params] as const,
  search: (params?: Partial<SearchParamsDTO>) => [SEARCH_IMAGES, params] as const,
  imageSearchTags: (params?: Partial<UseSearchTags>) => [IMAGE_SEARCH_TAGS, params] as const,
  imageEditors: [IMAGE_EDITORS] as const,
};

export const imageQueryOptions = (params: UseImage) => {
  return queryOptions({
    queryKey: imageQueryKeys.image(params),
    queryFn: () => fetchImage(params.id, params.language),
  });
};

export const searchImagesQueryOptions = (query: SearchParamsDTO) => {
  return queryOptions({
    queryKey: imageQueryKeys.search(query),
    queryFn: () => postSearchImages(query),
  });
};

interface UseSearchTags {
  input: string;
  language: string;
}

export const imageSearchTagsQueryOptions = (params: UseSearchTags) => {
  return queryOptions({
    queryKey: imageQueryKeys.imageSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
  });
};

export const imageEditorsQueryOptions = () => {
  return queryOptions({
    queryKey: imageQueryKeys.imageEditors,
    queryFn: fetchImageEditors,
  });
};
