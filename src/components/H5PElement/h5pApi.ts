/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { H5pLicenseInformation, H5pPreviewResponse } from "@ndla/types-embed";
import config from "../../config";
import { fetchReAuthorized, resolveJsonOrRejectWithError } from "../../util/apiHelpers";

export interface H5PInfo {
  h5pLibrary: {
    majorVersion: number;
    minorVersion: number;
    name: string;
  };
  published: boolean;
  title: string;
}

export interface H5pCopyResponse {
  url: string;
}

export const fetchH5PiframeUrl = (
  locale: string = "",
  canReturnResources: boolean = false,
): Promise<{ url: string }> => {
  return fetchReAuthorized(
    `${config.h5pApiUrl}/select?locale=${getH5pLocale(locale)}&canReturnResources=${canReturnResources}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer JWT-token` },
    },
  ).then((r) => resolveJsonOrRejectWithError(r));
};

export const editH5PiframeUrl = (url: string, locale: string = ""): Promise<{ url: string }> => {
  return fetchReAuthorized(`${config.h5pApiUrl}/select/edit/byurl?locale=${getH5pLocale(locale)}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Authorization: `Bearer JWT-token`,
    },
    method: "POST",
    body: `url=${encodeURIComponent(url)}`,
  }).then((r) => resolveJsonOrRejectWithError(r));
};

export const getH5pLocale = (language: string) => {
  return language === "en" ? "en-gb" : "nn" === language ? "nn-no" : "nb-no";
};

export const fetchH5pPreviewOembed = async (url: string): Promise<H5pPreviewResponse> =>
  fetch(`${config.h5pApiUrl}/oembed/preview?${new URLSearchParams({ url }).toString()}`).then((r) =>
    resolveJsonOrRejectWithError(r),
  );

export const fetchH5pLicenseInformation = async (resourceId: string): Promise<H5pLicenseInformation | undefined> => {
  const url = `${config.h5pApiUrl}/v2/resource/${resourceId}/copyright`;
  return await fetch(url)
    .then((r) => resolveJsonOrRejectWithError<H5pLicenseInformation>(r))
    .catch((_) => undefined);
};

export const fetchH5PInfo = async (resourceId: string): Promise<H5PInfo> => {
  const url = `${config.h5pApiUrl}/v1/resource/${resourceId}/info`;
  return fetch(url).then((r) => resolveJsonOrRejectWithError(r));
};

export const copyH5P = async (url: string): Promise<H5pCopyResponse> => {
  const h5pUrl = `${config.h5pApiUrl}/copy`;
  return await fetchReAuthorized(h5pUrl, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Authorization: `Bearer JWT-token`,
    },
    method: "POST",
    body: `url=${encodeURIComponent(url)}`,
  }).then((r) => resolveJsonOrRejectWithError(r));
};
