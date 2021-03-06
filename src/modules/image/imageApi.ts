/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import defined from 'defined';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
  createErrorPayload,
} from '../../util/apiHelpers';
import {
  ImageApiType,
  ImageSearchQuery,
  ImageSearchResult,
  TagSearchResult,
  UpdatedImageMetadata,
} from './imageApiInterfaces';

const baseUrl = apiResourceUrl('/image-api/v2/images');

export const postImage = (formData: FormData): Promise<ImageApiType> =>
  fetchAuthorized(`${baseUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then(resolveJsonOrRejectWithError);

export const fetchImage = (id: number, language?: string): Promise<ImageApiType> =>
  fetchAuthorized(`${baseUrl}/${id}?language=${language}`).then(resolveJsonOrRejectWithError);

export const updateImage = (imageMetadata: UpdatedImageMetadata): Promise<ImageApiType> =>
  fetchAuthorized(`${baseUrl}/${imageMetadata.id}`, {
    method: 'PATCH',
    body: JSON.stringify(imageMetadata),
  }).then(resolveJsonOrRejectWithError);

export const patchImage = (id: number, formData: FormData): Promise<ImageApiType> =>
  fetchAuthorized(`${baseUrl}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then(resolveJsonOrRejectWithError);

export const searchImages = (query: ImageSearchQuery): Promise<ImageSearchResult> => {
  const response = fetchAuthorized(`${baseUrl}/?${queryString.stringify(query)}`).then(
    resolveJsonOrRejectWithError,
  );
  return response;
};

export const onError = (err: Response & Error) => {
  createErrorPayload(err.status, defined(err.message, err.statusText), err);
};

export const deleteLanguageVersionImage = (
  imageId: number,
  locale: string,
): Promise<ImageApiType> | void =>
  fetchAuthorized(`${baseUrl}/${imageId}/language/${locale}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);

export const fetchSearchTags = async (
  input: string,
  language: string,
): Promise<TagSearchResult> => {
  const response = await fetchAuthorized(
    `${baseUrl}/tag-search/?language=${language}&query=${input}`,
  );
  return resolveJsonOrRejectWithError(response);
};
