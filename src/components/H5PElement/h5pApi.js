/**
 * Copyright (c) 2017-present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from '../../config';
import {
  resolveJsonOrRejectWithError,
  fetchReAuthorized,
} from '../../util/apiHelpers';

export const fetchH5PiframeUrl = async () => {
  const response = await fetchReAuthorized(`${config.h5pApiUrl}/select`, {
    method: 'POST',
    headers: { Authorization: `Bearer JWT-token` },
  });
  return resolveJsonOrRejectWithError(response);
};

export const editH5PiframeUrl = async url => {
  const response = await fetchReAuthorized(
    `${config.h5pApiUrl}/select/edit/byurl`,
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
