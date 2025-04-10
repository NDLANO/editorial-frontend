/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ISubjectPageDTO,
  IFilmFrontPageDTO,
  INewSubjectPageDTO,
  IUpdatedSubjectPageDTO,
  INewOrUpdatedFilmFrontPageDTO,
  IFrontPageDTO,
  openapi,
} from "@ndla/types-backend/frontpage-api";
import { LocaleType } from "../../interfaces";
import { createAuthClient } from "../../util/apiHelpers";
import { resolveJsonOATS } from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>();

export const fetchFrontpage = () => client.GET("/frontpage-api/v1/frontpage").then(resolveJsonOATS);

export const postFrontpage = (body: IFrontPageDTO) =>
  client.POST("/frontpage-api/v1/frontpage", { body }).then(resolveJsonOATS);

export const fetchFilmFrontpage = () => client.GET("/frontpage-api/v1/filmfrontpage").then(resolveJsonOATS);

export const updateFilmFrontpage = (filmfrontpage: INewOrUpdatedFilmFrontPageDTO): Promise<IFilmFrontPageDTO> =>
  client.POST("/frontpage-api/v1/filmfrontpage", { body: filmfrontpage }).then(resolveJsonOATS);

export const fetchSubjectpage = (id: number, language: LocaleType): Promise<ISubjectPageDTO> =>
  client
    .GET("/frontpage-api/v1/subjectpage/{subjectpage-id}", {
      params: {
        path: { "subjectpage-id": id },
        query: { language, fallback: language ? undefined : true },
      },
    })
    .then(resolveJsonOATS);

export const updateSubjectpage = (
  subjectpage: IUpdatedSubjectPageDTO,
  subjectpageId: number,
  language: LocaleType,
): Promise<ISubjectPageDTO> =>
  client
    .PATCH("/frontpage-api/v1/subjectpage/{subjectpage-id}", {
      body: subjectpage,
      params: {
        path: { "subjectpage-id": subjectpageId },
        query: { language },
      },
    })
    .then(resolveJsonOATS);

export const createSubjectpage = (body: INewSubjectPageDTO): Promise<ISubjectPageDTO> =>
  client.POST("/frontpage-api/v1/subjectpage", { body }).then(resolveJsonOATS);

export const deleteSubectPageLanguageVersion = (subjectPageId: number, language: string): Promise<ISubjectPageDTO> =>
  client
    .DELETE("/frontpage-api/v1/subjectpage/{subjectpage-id}/language/{language}", {
      params: {
        path: {
          "subjectpage-id": subjectPageId,
          language,
        },
      },
    })
    .then(resolveJsonOATS);

export const deleteFilmFrontPageLanguageVersion = (language: string): Promise<IFilmFrontPageDTO> =>
  client
    .DELETE("/frontpage-api/v1/filmfrontpage/language/{language}", {
      params: { path: { language } },
    })
    .then(resolveJsonOATS);
