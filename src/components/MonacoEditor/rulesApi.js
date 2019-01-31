/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// import {
//   resolveJsonOrRejectWithError,
//   apiResourceUrl,
//   fetchAuthorized,
// } from '../../util/apiHelpers';

// const baseUrl = apiResourceUrl('/draft-api/rules');
// const baseUrl =
//   'http://localhost:3000/rules/NDLANO/validation/master/src/main/resources/';

export async function fetchEmbedTagRules() {
  const rules = await import('./embed-tag-rules.json');
  return rules.default;
  // const response = await fetchAuthorized(`${baseUrl}/embed-tag`);
  // return resolveJsonOrRejectWithError(response);
}
export async function fetchHTMLRules() {
  const rules = await import('./html-rules.json');
  return rules.default;
  // const response = await fetchAuthorized(`${baseUrl}/embed-tag`);
  // return resolveJsonOrRejectWithError(response);
}

export async function fetchMathMLRules() {
  let rules = await import('./mathml-rules.json');
  return rules.default;
  // const response = await fetchAuthorized(`${baseUrl}/embed-tag`);
  // return resolveJsonOrRejectWithError(response);
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
