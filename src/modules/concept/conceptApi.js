/*
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

const conceptUrl = apiResourceUrl('/concept-api/v1/concepts');

export const fetchAllConcepts = async locale => {
  const response = await fetchAuthorized(`${conceptUrl}?language=${locale}`);
  const concept = await resolveJsonOrRejectWithError(response);
  return concept;
};

export const fetchConcept = async (conceptId, locale) => {
  const response = await fetchAuthorized(
    `${conceptUrl}/${conceptId}?language=${locale}&fallback=true`,
  );
  const concept = await resolveJsonOrRejectWithError(response);
  return concept;
};

export const addConcept = concept =>
  fetchAuthorized(`${conceptUrl}/`, {
    method: 'POST',
    body: JSON.stringify(concept),
  }).then(resolveJsonOrRejectWithError);

export const updateConcept = concept =>
  fetchAuthorized(`${conceptUrl}/${concept.id}`, {
    method: 'PATCH',
    body: JSON.stringify(concept),
  }).then(resolveJsonOrRejectWithError);
