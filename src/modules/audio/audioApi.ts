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
  openapi,
  INewAudioMetaInformationDTO,
  UpdatedAudioMetaInformationDTO,
} from "@ndla/types-backend/audio-api";
import { createAuthClient } from "../../util/apiHelpers";
import { resolveJsonOATS, resolveOATS } from "../../util/resolveJsonOrRejectWithError";
import { createFormData } from "../../util/formDataHelper";
import { StringSort } from "../../interfaces";

const client = createAuthClient<openapi.paths>();

export const postAudio = (metadata: INewAudioMetaInformationDTO, file: Blob): Promise<IAudioMetaInformationDTO> =>
  client
    .POST("/audio-api/v1/audio", {
      body: {
        metadata,
        file,
      },
      bodySerializer(body) {
        return createFormData(body.file, body.metadata);
      },
    })
    .then((r) => resolveJsonOATS(r));

export const fetchAudio = async (id: number, locale?: string): Promise<IAudioMetaInformationDTO> =>
  client
    .GET("/audio-api/v1/audio/{audio-id}", {
      params: {
        path: {
          "audio-id": id,
        },
        query: {
          language: locale,
          fallback: true,
        },
      },
    })
    .then((r) => resolveJsonOATS(r));

export const updateAudio = async (
  id: number,
  metadata: UpdatedAudioMetaInformationDTO,
  file: Blob | undefined,
): Promise<IAudioMetaInformationDTO> =>
  client
    .PUT("/audio-api/v1/audio/{audio-id}", {
      params: {
        path: {
          "audio-id": id,
        },
      },
      body: {
        metadata,
        file,
      },
      bodySerializer(body) {
        return createFormData(body.file, body.metadata);
      },
    })
    .then((r) => resolveJsonOATS(r));

export const postSearchAudio = async (body: StringSort<ISearchParamsDTO>): Promise<IAudioSummarySearchResultDTO> =>
  client
    .POST("/audio-api/v1/audio/search", {
      body: {
        ...body,
        // @ts-expect-error TODO: API's use different sorting types and we share them in the frontend
        sort: body.sort,
      },
    })
    .then((r) => resolveJsonOATS(r));

export const deleteLanguageVersionAudio = async (
  audioId: number,
  locale: string,
): Promise<IAudioMetaInformationDTO | void> =>
  client
    .DELETE("/audio-api/v1/audio/{audio-id}/language/{language}", {
      params: { path: { "audio-id": audioId, language: locale } },
    })
    .then((r) => resolveOATS(r));

export const deleteLanguageVersionSeries = async (seriesId: number, language: string): Promise<ISeriesDTO | void> =>
  client
    .DELETE("/audio-api/v1/series/{series-id}/language/{language}", {
      params: { path: { "series-id": seriesId, language } },
    })
    .then((r) => resolveOATS(r));

export const fetchSearchTags = async (query: string, language: string): Promise<ITagsSearchResultDTO> =>
  client
    .GET("/audio-api/v1/audio/tag-search", {
      params: { query: { language, query } },
    })
    .then((r) => resolveJsonOATS(r));

export const fetchSeries = async (id: number, language?: string): Promise<ISeriesDTO> =>
  client
    .GET("/audio-api/v1/series/{series-id}", {
      params: { path: { "series-id": id }, query: { language } },
    })
    .then((r) => resolveJsonOATS(r));

export const postSeries = async (newSeries: INewSeriesDTO): Promise<ISeriesDTO> =>
  client.POST("/audio-api/v1/series", { body: newSeries }).then((r) => resolveJsonOATS(r));

export const updateSeries = (id: number, newSeries: INewSeriesDTO): Promise<ISeriesDTO> =>
  client
    .PUT("/audio-api/v1/series/{series-id}", {
      params: { path: { "series-id": id } },
      body: newSeries,
    })
    .then((r) => resolveJsonOATS(r));

export const postSearchSeries = async (
  body: StringSort<ISeriesSearchParamsDTO>,
): Promise<ISeriesSummarySearchResultDTO> =>
  client
    .POST("/audio-api/v1/series/search", {
      body: {
        ...body,
        // @ts-expect-error TODO: API's use different sorting types and we share them in the frontend
        sort: body.sort,
      },
    })
    .then((r) => resolveJsonOATS(r));

export const postAudioTranscription = async (audioName: string, audioId: number, language: string): Promise<string> =>
  client
    .POST("/audio-api/v1/transcription/audio/{audioName}/{audioId}/{language}", {
      params: { path: { audioName, audioId, language } },
    })
    .then((r) => resolveJsonOATS(r));

export const fetchAudioTranscription = async (audioId: number, language: string): Promise<ITranscriptionResultDTO> =>
  client
    .GET("/audio-api/v1/transcription/audio/{audioId}/{language}", {
      params: { path: { audioId, language } },
    })
    .then((r) => resolveJsonOATS(r));
