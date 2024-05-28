/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IAudioMetaInformation,
  IAudioSummarySearchResult,
  ISeriesSummarySearchResult,
  ISeries,
  INewSeries,
  ITagsSearchResult,
  ISeriesSearchParams,
  ISearchParams,
} from "@ndla/types-backend/audio-api";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { apiResourceUrl, fetchAuthorized, resolveJsonOrRejectWithError } from "../../util/apiHelpers";
import { resolveJsonOrVoidOrRejectWithError } from "../../util/resolveJsonOrRejectWithError";

const baseUrl = apiResourceUrl("/audio-api/v1/audio");
const seriesBaseUrl = apiResourceUrl("/audio-api/v1/series");

export const postAudio = (formData: FormData): Promise<IAudioMetaInformation> =>
  fetchAuthorized(`${baseUrl}`, {
    method: "POST",
    headers: { "Content-Type": undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then((r) => resolveJsonOrRejectWithError<IAudioMetaInformation>(r));

export const fetchAudio = (id: number, locale?: string): Promise<IAudioMetaInformation> => {
  const languageParam = locale ? `?language=${locale}&fallback=true` : "";
  return fetchAuthorized(`${baseUrl}/${id}${languageParam}`).then((r) =>
    resolveJsonOrRejectWithError<IAudioMetaInformation>(r),
  );
};

export const updateAudio = (id: number, formData: FormData): Promise<IAudioMetaInformation> =>
  fetchAuthorized(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then((r) => resolveJsonOrRejectWithError<IAudioMetaInformation>(r));

export const postSearchAudio = async (body: StringSort<ISearchParams>): Promise<IAudioSummarySearchResult> => {
  const response = await fetchAuthorized(`${baseUrl}/search/`, { method: "POST", body: JSON.stringify(body) });
  return resolveJsonOrRejectWithError(response);
};

export const deleteLanguageVersionAudio = (audioId: number, locale: string): Promise<IAudioMetaInformation | void> =>
  fetchAuthorized(`${baseUrl}/${audioId}/language/${locale}`, {
    method: "DELETE",
  }).then((r) => resolveJsonOrVoidOrRejectWithError(r));

export const deleteLanguageVersionSeries = (seriesId: number, language: string): Promise<ISeries | void> => {
  return fetchAuthorized(`${seriesBaseUrl}/${seriesId}/language/${language}`, {
    method: "DELETE",
  }).then((r) => resolveJsonOrVoidOrRejectWithError(r));
};

export const fetchSearchTags = async (input: string, language: string): Promise<ITagsSearchResult> => {
  const response = await fetchAuthorized(`${baseUrl}/tag-search/?language=${language}&query=${input}`);
  return resolveJsonOrRejectWithError(response);
};

export const fetchSeries = (id: number, language?: string): Promise<ISeries> => {
  const languageParam = language ? `?language=${language}` : "";
  return fetchAuthorized(`${seriesBaseUrl}/${id}${languageParam}`).then((r) =>
    resolveJsonOrRejectWithError<ISeries>(r),
  );
};

export const postSeries = (newSeries: INewSeries): Promise<ISeries> =>
  fetchAuthorized(`${seriesBaseUrl}`, {
    method: "POST",
    body: JSON.stringify(newSeries),
  }).then((r) => resolveJsonOrRejectWithError<ISeries>(r));

export const updateSeries = (id: number, newSeries: INewSeries): Promise<ISeries> =>
  fetchAuthorized(`${seriesBaseUrl}/${id}`, {
    method: "PUT",
    body: JSON.stringify(newSeries),
  }).then((r) => resolveJsonOrRejectWithError<ISeries>(r));

export const postSearchSeries = async (body: StringSort<ISeriesSearchParams>): Promise<ISeriesSummarySearchResult> => {
  const response = await fetchAuthorized(`${seriesBaseUrl}/search/`, { method: "POST", body: JSON.stringify(body) });
  return resolveJsonOrRejectWithError(response);
};
