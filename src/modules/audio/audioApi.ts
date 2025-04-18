/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IAudioMetaInformationDTO,
  IAudioSummarySearchResultDTO,
  ISeriesSummarySearchResultDTO,
  ISeriesDTO,
  INewSeriesDTO,
  ITagsSearchResultDTO,
  ISeriesSearchParamsDTO,
  ISearchParamsDTO,
  ITranscriptionResultDTO,
} from "@ndla/types-backend/audio-api";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { apiResourceUrl, fetchAuthorized, resolveJsonOrRejectWithError } from "../../util/apiHelpers";
import {
  resolveJsonOrVoidOrRejectWithError,
  resolveTextOrRejectWithError,
} from "../../util/resolveJsonOrRejectWithError";

const baseUrl = apiResourceUrl("/audio-api/v1/audio");
const seriesBaseUrl = apiResourceUrl("/audio-api/v1/series");
const transcribeUrl = apiResourceUrl("/audio-api/v1/transcription");

export const postAudio = (formData: FormData): Promise<IAudioMetaInformationDTO> =>
  fetchAuthorized(`${baseUrl}`, {
    method: "POST",
    headers: { "Content-Type": undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then((r) => resolveJsonOrRejectWithError<IAudioMetaInformationDTO>(r));

export const fetchAudio = (id: number, locale?: string): Promise<IAudioMetaInformationDTO> => {
  const languageParam = locale ? `?language=${locale}&fallback=true` : "";
  return fetchAuthorized(`${baseUrl}/${id}${languageParam}`).then((r) =>
    resolveJsonOrRejectWithError<IAudioMetaInformationDTO>(r),
  );
};

export const updateAudio = (id: number, formData: FormData): Promise<IAudioMetaInformationDTO> =>
  fetchAuthorized(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then((r) => resolveJsonOrRejectWithError<IAudioMetaInformationDTO>(r));

export const postSearchAudio = async (body: StringSort<ISearchParamsDTO>): Promise<IAudioSummarySearchResultDTO> => {
  const response = await fetchAuthorized(`${baseUrl}/search/`, { method: "POST", body: JSON.stringify(body) });
  return resolveJsonOrRejectWithError(response);
};

export const deleteLanguageVersionAudio = (audioId: number, locale: string): Promise<IAudioMetaInformationDTO | void> =>
  fetchAuthorized(`${baseUrl}/${audioId}/language/${locale}`, {
    method: "DELETE",
  }).then((r) => resolveJsonOrVoidOrRejectWithError(r));

export const deleteLanguageVersionSeries = (seriesId: number, language: string): Promise<ISeriesDTO | void> => {
  return fetchAuthorized(`${seriesBaseUrl}/${seriesId}/language/${language}`, {
    method: "DELETE",
  }).then((r) => resolveJsonOrVoidOrRejectWithError(r));
};

export const fetchSearchTags = async (input: string, language: string): Promise<ITagsSearchResultDTO> => {
  const response = await fetchAuthorized(`${baseUrl}/tag-search/?language=${language}&query=${input}`);
  return resolveJsonOrRejectWithError(response);
};

export const fetchSeries = (id: number, language?: string): Promise<ISeriesDTO> => {
  const languageParam = language ? `?language=${language}` : "";
  return fetchAuthorized(`${seriesBaseUrl}/${id}${languageParam}`).then((r) =>
    resolveJsonOrRejectWithError<ISeriesDTO>(r),
  );
};

export const postSeries = (newSeries: INewSeriesDTO): Promise<ISeriesDTO> =>
  fetchAuthorized(`${seriesBaseUrl}`, {
    method: "POST",
    body: JSON.stringify(newSeries),
  }).then((r) => resolveJsonOrRejectWithError<ISeriesDTO>(r));

export const updateSeries = (id: number, newSeries: INewSeriesDTO): Promise<ISeriesDTO> =>
  fetchAuthorized(`${seriesBaseUrl}/${id}`, {
    method: "PUT",
    body: JSON.stringify(newSeries),
  }).then((r) => resolveJsonOrRejectWithError<ISeriesDTO>(r));

export const postSearchSeries = async (
  body: StringSort<ISeriesSearchParamsDTO>,
): Promise<ISeriesSummarySearchResultDTO> => {
  const response = await fetchAuthorized(`${seriesBaseUrl}/search/`, { method: "POST", body: JSON.stringify(body) });
  return resolveJsonOrRejectWithError(response);
};

export const postAudioTranscription = async (audioName: string, audioId: number, language: string): Promise<string> => {
  const response = await fetchAuthorized(`${transcribeUrl}/audio/${audioName}/${audioId}/${language}`, {
    method: "POST",
  });
  return resolveTextOrRejectWithError(response);
};

export const fetchAudioTranscription = async (audioId: number, language: string): Promise<ITranscriptionResultDTO> => {
  const response = await fetchAuthorized(`${transcribeUrl}/audio/${audioId}/${language}`, { method: "GET" });
  return resolveJsonOrRejectWithError<ITranscriptionResultDTO>(response);
};
