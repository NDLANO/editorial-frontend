/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import {
  IImageMetaInformationV2 as ImageApiType,
  IUpdateImageMetaInformation as UpdatedImageMetadata,
  ISearchResult as ImageSearchResult,
  ITagsSearchResult as TagSearchResult,
} from '@ndla/types-image-api';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
  createErrorPayload,
} from '../../util/apiHelpers';
import { ImageSearchQuery } from './imageApiInterfaces';
import { resolveJsonOrVoidOrRejectWithError } from '../../util/resolveJsonOrRejectWithError';

const baseUrl = apiResourceUrl('/image-api/v2/images');

export const postImage = (formData: FormData): Promise<ImageApiType> =>
  fetchAuthorized(`${baseUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then(r => resolveJsonOrRejectWithError<ImageApiType>(r));

export const fetchImage = (id: number | string, language?: string): Promise<ImageApiType> =>
  fetchAuthorized(`${baseUrl}/${id}?language=${language}`).then(r =>
    resolveJsonOrRejectWithError<ImageApiType>(r),
  );

export const updateImage = (
  id: number,
  imageMetadata: UpdatedImageMetadata,
  formData?: FormData,
): Promise<ImageApiType> =>
  fetchAuthorized(`${baseUrl}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData || JSON.stringify(imageMetadata),
  }).then(r => resolveJsonOrRejectWithError<ImageApiType>(r));

export const searchImages = (query: ImageSearchQuery): Promise<ImageSearchResult> => {
  const response = fetchAuthorized(`${baseUrl}/?${queryString.stringify(query)}`).then(r =>
    resolveJsonOrRejectWithError<ImageSearchResult>(r),
  );
  return response;
};

export const onError = (err: Response & Error) => {
  createErrorPayload(err.status, err.message ?? err.statusText, err);
};

export const deleteLanguageVersionImage = (
  imageId: number,
  locale: string,
): Promise<ImageApiType | void> =>
  fetchAuthorized(`${baseUrl}/${imageId}/language/${locale}`, {
    method: 'DELETE',
  }).then(r => resolveJsonOrVoidOrRejectWithError(r));

export const fetchSearchTags = async (
  input: string,
  language: string,
): Promise<TagSearchResult> => {
  const response = await fetchAuthorized(
    `${baseUrl}/tag-search/?language=${language}&query=${input}`,
  );
  return resolveJsonOrRejectWithError(response);
};
