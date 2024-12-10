/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import queryString from "query-string";
import {
  ISubjectPageDataDTO,
  IFilmFrontPageDataDTO,
  INewSubjectFrontPageDataDTO,
  IUpdatedSubjectFrontPageDataDTO,
  INewOrUpdatedFilmFrontPageDataDTO,
  IFrontPageDTO,
} from "@ndla/types-backend/frontpage-api";
import { LocaleType } from "../../interfaces";
import { resolveJsonOrRejectWithError, apiResourceUrl, fetchAuthorized } from "../../util/apiHelpers";

const baseUrl = apiResourceUrl("/frontpage-api/v1");

export const fetchFrontpage = () =>
  fetchAuthorized(`${baseUrl}/frontpage`).then((r) => resolveJsonOrRejectWithError<IFrontPageDTO>(r));

export const postFrontpage = (frontpage: IFrontPageDTO) =>
  fetchAuthorized(`${baseUrl}/frontpage`, {
    method: "POST",
    body: JSON.stringify(frontpage),
  }).then((r) => resolveJsonOrRejectWithError<IFrontPageDTO>(r));

export const fetchFilmFrontpage = () =>
  fetchAuthorized(`${baseUrl}/filmfrontpage/`).then((r) => resolveJsonOrRejectWithError<IFilmFrontPageDataDTO>(r));

export const updateFilmFrontpage = (
  filmfrontpage: INewOrUpdatedFilmFrontPageDataDTO,
): Promise<IFilmFrontPageDataDTO> => {
  return fetchAuthorized(`${baseUrl}/filmfrontpage/`, {
    method: "POST",
    body: JSON.stringify(filmfrontpage),
  }).then((r) => resolveJsonOrRejectWithError<IFilmFrontPageDataDTO>(r));
};

export const fetchSubjectpage = (id: number | string, language: LocaleType): Promise<ISubjectPageDataDTO> => {
  const query = queryString.stringify({ language });
  const url = `${baseUrl}/subjectpage/${id}`;
  const urlLang = language ? url + `?${query}&fallback=true` : url;
  return fetchAuthorized(urlLang).then((r) => resolveJsonOrRejectWithError(r));
};

export const updateSubjectpage = (
  subjectpage: IUpdatedSubjectFrontPageDataDTO,
  subjectpageId: number | string,
  language: LocaleType,
): Promise<ISubjectPageDataDTO> => {
  const query = queryString.stringify({ language });
  return fetchAuthorized(`${baseUrl}/subjectpage/${subjectpageId}?${query}`, {
    method: "PATCH",
    body: JSON.stringify(subjectpage),
  }).then((r) => resolveJsonOrRejectWithError(r));
};

export const createSubjectpage = (subjectpage: INewSubjectFrontPageDataDTO): Promise<ISubjectPageDataDTO> =>
  fetchAuthorized(`${baseUrl}/subjectpage/`, {
    method: "POST",
    body: JSON.stringify(subjectpage),
  }).then((r) => resolveJsonOrRejectWithError(r));
