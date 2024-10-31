/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  IImageMetaInformationV3,
  IUpdateImageMetaInformation,
  ISearchResultV3,
  ITagsSearchResult,
  ISearchParams,
} from "@ndla/types-backend/image-api";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
  throwErrorPayload,
} from "../../util/apiHelpers";
import { resolveJsonOrVoidOrRejectWithError } from "../../util/resolveJsonOrRejectWithError";

const baseUrl = apiResourceUrl("/image-api/v3/images");

export const postImage = (formData: FormData): Promise<IImageMetaInformationV3> =>
  fetchAuthorized(`${baseUrl}`, {
    method: "POST",
    headers: { "Content-Type": undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData,
  }).then((r) => resolveJsonOrRejectWithError<IImageMetaInformationV3>(r));

export const fetchImage = (id: number | string, language?: string): Promise<IImageMetaInformationV3> =>
  fetchAuthorized(`${baseUrl}/${id}?language=${language}`).then((r) =>
    resolveJsonOrRejectWithError<IImageMetaInformationV3>(r),
  );

export const updateImage = (
  id: number,
  imageMetadata: IUpdateImageMetaInformation,
  formData?: FormData,
): Promise<IImageMetaInformationV3> =>
  fetchAuthorized(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": undefined }, // Without this we're missing a boundary: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    body: formData || JSON.stringify(imageMetadata),
  }).then((r) => resolveJsonOrRejectWithError<IImageMetaInformationV3>(r));

export const postSearchImages = async (body: StringSort<ISearchParams>): Promise<ISearchResultV3> => {
  const response = await fetchAuthorized(`${baseUrl}/search/`, { method: "POST", body: JSON.stringify(body) });
  return resolveJsonOrRejectWithError(response);
};

export const onError = (err: Response & Error) => {
  throwErrorPayload(err.status, err.message ?? err.statusText, err);
};

export const deleteLanguageVersionImage = (imageId: number, locale: string): Promise<IImageMetaInformationV3 | void> =>
  fetchAuthorized(`${baseUrl}/${imageId}/language/${locale}`, {
    method: "DELETE",
  }).then((r) => resolveJsonOrVoidOrRejectWithError(r));

export const fetchSearchTags = async (input: string, language: string): Promise<ITagsSearchResult> => {
  const response = await fetchAuthorized(`${baseUrl}/tag-search/?language=${language}&query=${input}`);
  return resolveJsonOrRejectWithError(response);
};
