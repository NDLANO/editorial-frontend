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
  AudioSearchResult,
  NewPodcastSeries,
  PodcastSeriesApiType,
  SeriesSearchParams,
  SeriesSearchResult,
  TagSearchResult,
} from './audioApiInterfaces';

const baseUrl = apiResourceUrl('/audio-api/v1/audio');
const seriesBaseUrl = apiResourceUrl('/audio-api/v1/series');

export const postAudio = (formData: FormData): Promise<AudioApiType> =>
  fetchAuthorized(`${baseUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then(r => resolveJsonOrRejectWithError<AudioApiType>(r));

export const fetchAudio = (id: number, locale: string): Promise<AudioApiType> =>
  fetchAuthorized(`${baseUrl}/${id}?language=${locale}`).then(r =>
    resolveJsonOrRejectWithError<AudioApiType>(r),
  );

export const updateAudio = (id: number, formData: FormData): Promise<AudioApiType> =>
  fetchAuthorized(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then(r => resolveJsonOrRejectWithError<AudioApiType>(r));

export const searchAudio = (query: object): Promise<AudioSearchResult> =>
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

export const fetchSeries = (id: number, language: string): Promise<PodcastSeriesApiType> =>
  fetchAuthorized(`${seriesBaseUrl}/${id}?language=${language}`).then(r =>
    resolveJsonOrRejectWithError<PodcastSeriesApiType>(r),
  );

export const postSeries = (newSeries: NewPodcastSeries): Promise<PodcastSeriesApiType> =>
  fetchAuthorized(`${seriesBaseUrl}`, {
    method: 'POST',
    body: JSON.stringify(newSeries),
  }).then(r => resolveJsonOrRejectWithError<PodcastSeriesApiType>(r));

export const updateSeries = (
  id: number,
  newSeries: NewPodcastSeries,
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
