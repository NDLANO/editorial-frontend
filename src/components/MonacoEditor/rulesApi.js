/**
 * Copyright (c) 2019-present, NDLA.
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

const baseUrl = apiResourceUrl('/draft-api/v1/rules');

export async function fetchEmbedTagRules() {
  const response = await fetchAuthorized(`${baseUrl}/embed-tag/`);
  return resolveJsonOrRejectWithError(response);
}
export async function fetchHTMLRules() {
  const response = await fetchAuthorized(`${baseUrl}/html/`);
  return resolveJsonOrRejectWithError(response);
}

export async function fetchMathMLRules() {
  const response = await fetchAuthorized(`${baseUrl}/mathml/`);
  return resolveJsonOrRejectWithError(response);
}

export async function fetchAllRules() {
  let [htmlRules, mathmlRules, embedRules] = await Promise.all([
    fetchHTMLRules(),
    fetchMathMLRules(),
    fetchEmbedTagRules(),
  ]);

  return {
    htmlRules,
    mathmlRules,
    embedRules,
  };
}
