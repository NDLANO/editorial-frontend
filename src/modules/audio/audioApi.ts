/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { resolveJsonOrVoidOrRejectWithError } from '../../util/resolveJsonOrRejectWithError';
import {
  apiResourceUrl,
  fetchAuthorized,
  resolveJsonOrRejectWithError,
} from '../../util/apiHelpers';
import {
  AudioApiType,
  AudioSearchParams,
  AudioSearchResult,
  PodcastSeriesPost,
  PodcastSeriesApiType,
  SeriesSearchParams,
  SeriesSearchResult,
  TagSearchResult,
  PodcastSeriesPut,
} from './audioApiInterfaces';

const baseUrl = apiResourceUrl('/audio-api/v1/audio');
const seriesBaseUrl = apiResourceUrl('/audio-api/v1/series');

export const postAudio = (formData: FormData): Promise<AudioApiType> =>
  fetchAuthorized(`${baseUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then(r => resolveJsonOrRejectWithError<AudioApiType>(r));

export const fetchAudio = (id: string | number, locale?: string): Promise<AudioApiType> => {
  const languageParam = locale ? `?language=${locale}` : '';
  return fetchAuthorized(`${baseUrl}/${id}${languageParam}`).then(r =>
    resolveJsonOrRejectWithError<AudioApiType>(r),
  );
};

export const updateAudio = (id: number, formData: FormData): Promise<AudioApiType> =>
  fetchAuthorized(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then(r => resolveJsonOrRejectWithError<AudioApiType>(r));

export const searchAudio = (query: AudioSearchParams): Promise<AudioSearchResult> =>
  fetchAuthorized(`${baseUrl}/?${queryString.stringify(query)}`).then(r =>
    resolveJsonOrRejectWithError<AudioSearchResult>(r),
  );

export const deleteLanguageVersionAudio = (
  audioId: number,
  locale: string,
): Promise<AudioApiType | void> =>
  fetchAuthorized(`${baseUrl}/${audioId}/language/${locale}`, {
    method: 'DELETE',
  }).then(r => resolveJsonOrVoidOrRejectWithError(r));

export const deleteLanguageVersionSeries = (
  seriesId: number,
  language: string,
): Promise<PodcastSeriesApiType | void> => {
  return fetchAuthorized(`${seriesBaseUrl}/${seriesId}/language/${language}`, {
    method: 'DELETE',
  }).then(r => resolveJsonOrVoidOrRejectWithError(r));
};

export const fetchSearchTags = async (
  input: string,
  language: string,
): Promise<TagSearchResult> => {
  const response = await fetchAuthorized(
    `${baseUrl}/tag-search/?language=${language}&query=${input}`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const fetchSeries = (
  id: number | string,
  language?: string,
): Promise<PodcastSeriesApiType> => {
  const languageParam = language ? `?language=${language}` : '';
  return fetchAuthorized(`${seriesBaseUrl}/${id}${languageParam}`).then(r =>
    resolveJsonOrRejectWithError<PodcastSeriesApiType>(r),
  );
};

export const postSeries = (newSeries: PodcastSeriesPost): Promise<PodcastSeriesApiType> =>
  fetchAuthorized(`${seriesBaseUrl}`, {
    method: 'POST',
    body: JSON.stringify(newSeries),
  }).then(r => resolveJsonOrRejectWithError<PodcastSeriesApiType>(r));

export const updateSeries = (
  id: number | string,
  newSeries: PodcastSeriesPut,
): Promise<PodcastSeriesApiType> =>
  fetchAuthorized(`${seriesBaseUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(newSeries),
  }).then(r => resolveJsonOrRejectWithError<PodcastSeriesApiType>(r));

export const searchSeries = (query: SeriesSearchParams): Promise<SeriesSearchResult> => {
  return fetchAuthorized(`${seriesBaseUrl}/?${queryString.stringify(query)}`).then(r =>
    resolveJsonOrRejectWithError<SeriesSearchResult>(r),
  );
};
