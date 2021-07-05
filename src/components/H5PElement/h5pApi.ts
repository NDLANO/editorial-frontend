/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from '../../config';
import { fetchReAuthorized, resolveJsonOrRejectWithError } from '../../util/apiHelpers';

export const fetchH5PiframeUrl = async (
  locale: string = '',
  canReturnResources: boolean = false,
): Promise<{ url: string }> => {
  const response = await fetchReAuthorized(
    `${config.h5pApiUrl}/select?locale=${getH5pLocale(
      locale,
    )}&canReturnResources=${canReturnResources}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer JWT-token` },
    },
  );
  return resolveJsonOrRejectWithError(response);
};

export const editH5PiframeUrl = async (
  url: string,
  locale: string = '',
): Promise<{ url: string }> => {
  const response = await fetchReAuthorized(
    `${config.h5pApiUrl}/select/edit/byurl?locale=${getH5pLocale(locale)}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: `Bearer JWT-token`,
      },
      method: 'POST',
      body: `url=${encodeURIComponent(url)}`,
    },
  );
  return resolveJsonOrRejectWithError(response);
};

export const getH5pLocale = (language: string) => {
  return language === 'en' ? 'en-gb' : 'nb-no';
};

export const fetchH5PMetadata = async (resourceId: string) => {
  const url = `${config.h5pApiUrl}/v1/resource/${resourceId}/copyright`;
  const response = await fetch(url);
  return resolveJsonOrRejectWithError(response);
};
