/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IAuthor } from '@ndla/types-draft-api';
import config from '../../config';
import { fetchReAuthorized, resolveJsonOrRejectWithError } from '../../util/apiHelpers';

export interface H5PData {
  authors: IAuthor[];
  contentType: string;
  license: string;
  licenseExtras: string;
  licenseVersion: string;
  source: string;
  thumbnail: string;
  title: string;
  yearFrom: string;
  yearTo: string;
}
export interface H5PMetadata {
  assets: H5PData[];
  h5p: H5PData;
  h5pLibrary: {
    majorVersion: number;
    minorVersion: number;
    name: string;
  };
}

export const fetchH5PiframeUrl = (
  locale: string = '',
  canReturnResources: boolean = false,
): Promise<{ url: string }> => {
  return fetchReAuthorized(
    `${config.h5pApiUrl}/select?locale=${getH5pLocale(
      locale,
    )}&canReturnResources=${canReturnResources}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer JWT-token` },
    },
  ).then(r => resolveJsonOrRejectWithError(r));
};

export const editH5PiframeUrl = (url: string, locale: string = ''): Promise<{ url: string }> => {
  return fetchReAuthorized(`${config.h5pApiUrl}/select/edit/byurl?locale=${getH5pLocale(locale)}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: `Bearer JWT-token`,
    },
    method: 'POST',
    body: `url=${encodeURIComponent(url)}`,
  }).then(r => resolveJsonOrRejectWithError(r));
};

export const getH5pLocale = (language: string) => {
  return language === 'en' ? 'en-gb' : 'nb-no';
};

export const fetchH5PMetadata = async (resourceId: string): Promise<H5PMetadata> => {
  const url = `${config.h5pApiUrl}/v1/resource/${resourceId}/copyright`;
  return fetch(url).then(r => resolveJsonOrRejectWithError(r));
};
