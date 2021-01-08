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

const draftConceptUrl = apiResourceUrl('/concept-api/v1/drafts');

export const fetchSearchTags = async (input, language) => {
  const response = await fetchAuthorized(
    `${draftConceptUrl}/tag-search/?language=${language}&query=${input}&fallback=true`,
  );
  return await resolveJsonOrRejectWithError(response);
};

export const fetchAllConcepts = async locale => {
  const response = await fetchAuthorized(
    `${draftConceptUrl}?language=${locale}`,
  );
  return await resolveJsonOrRejectWithError(response);
};

export const fetchConcept = async (conceptId, locale) => {
  const response = await fetchAuthorized(
    `${draftConceptUrl}/${conceptId}?language=${locale}&fallback=true`,
  );
  return await resolveJsonOrRejectWithError(response);
};

export const addConcept = concept =>
  fetchAuthorized(`${draftConceptUrl}/`, {
    method: 'POST',
    body: JSON.stringify(concept),
  }).then(resolveJsonOrRejectWithError);

export const updateConcept = concept =>
  fetchAuthorized(`${draftConceptUrl}/${concept.id}`, {
    method: 'PATCH',
    body: JSON.stringify(concept),
  }).then(resolveJsonOrRejectWithError);

export const deleteLanguageVersionConcept = (conceptId, locale) =>
  fetchAuthorized(`${draftConceptUrl}/${conceptId}?language=${locale}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);

export const fetchStatusStateMachine = () =>
  fetchAuthorized(`${draftConceptUrl}/status-state-machine/`).then(
    resolveJsonOrRejectWithError,
  );

export const updateConceptStatus = (id, status) =>
  fetchAuthorized(`${draftConceptUrl}/${id}/status/${status}`, {
    method: 'PUT',
  }).then(resolveJsonOrRejectWithError);

export const searchConcepts = query =>
  fetchAuthorized(`${draftConceptUrl}/search/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(resolveJsonOrRejectWithError);
