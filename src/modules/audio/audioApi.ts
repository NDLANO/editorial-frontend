/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import { AudioApiType, TagSearchResult } from './audioApiInterfaces';

const baseUrl = apiResourceUrl('/audio-api/v1/audio');

export const postAudio = (formData: FormData): Promise<AudioApiType> =>
  fetchAuthorized(`${baseUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then(resolveJsonOrRejectWithError);

export const fetchAudio = (id: number, locale: string): Promise<AudioApiType> =>
  fetchAuthorized(`${baseUrl}/${id}?language=${locale}`).then(resolveJsonOrRejectWithError);

export const updateAudio = (id: number, formData: FormData): Promise<AudioApiType> =>
  fetchAuthorized(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then(resolveJsonOrRejectWithError);

export const searchAudio = (query: object) =>
  fetchAuthorized(`${baseUrl}/?${queryString.stringify(query)}`).then(resolveJsonOrRejectWithError);

export const deleteLanguageVersionAudio = (
  audioId: number,
  locale: string,
): Promise<AudioApiType | undefined> =>
  fetchAuthorized(`${baseUrl}/${audioId}/language/${locale}`, {
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
