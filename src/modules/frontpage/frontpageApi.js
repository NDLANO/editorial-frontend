/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/frontpage-api/v1');

export const fetchFilmFrontpage = () =>
  fetchAuthorized(`${baseUrl}/filmfrontpage/`).then(
    resolveJsonOrRejectWithError,
  );

export const updateFilmFrontpage = filmfrontpage => {
  fetchAuthorized(`${baseUrl}/filmfrontpage/`, {
    method: 'POST',
    body: JSON.stringify(filmfrontpage),
  }).then(resolveJsonOrRejectWithError);
};
