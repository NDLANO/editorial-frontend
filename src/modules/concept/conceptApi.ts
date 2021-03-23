/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import queryString from 'query-string';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import {
  ConceptStatusStateMachineType,
  ConceptTagsSearchResult,
  ConceptQuery,
  ConceptSearchResult,
  NewConceptType,
  PatchConceptType,
  ApiConceptType,
} from './conceptApiInterfaces';
import { ConceptType, ConceptStatusType } from '../../interfaces';

import { transformApiToCleanConcept } from './conceptApiUtil';

const draftConceptUrl: string = apiResourceUrl('/concept-api/v1/drafts');

export const fetchSearchTags = async (
  input: string,
  language: string,
): Promise<ConceptTagsSearchResult> => {
  const response = await fetchAuthorized(
    `${draftConceptUrl}/tag-search/?language=${language}&query=${input}&fallback=true`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const fetchConcept = async (
  conceptId: number,
  locale: string,
  pure?: boolean,
): Promise<ConceptType> => {
  const response = await fetchAuthorized(
    `${draftConceptUrl}/${conceptId}?language=${locale}&fallback=true`,
  );
  return resolveJsonOrRejectWithError(response).then((resolved: ApiConceptType) =>
    pure ? resolved : transformApiToCleanConcept(resolved, locale),
  );
};

export const addConcept = async (concept: NewConceptType): Promise<ConceptType> =>
  fetchAuthorized(`${draftConceptUrl}/`, {
    method: 'POST',
    body: JSON.stringify(concept),
  })
    .then(resolveJsonOrRejectWithError)
    .then((newConcept: ApiConceptType) => transformApiToCleanConcept(newConcept, concept.language));

export const updateConcept = async (concept: PatchConceptType): Promise<ConceptType> =>
  fetchAuthorized(`${draftConceptUrl}/${concept.id}`, {
    method: 'PATCH',
    body: JSON.stringify(concept),
  })
    .then(resolveJsonOrRejectWithError)
    .then((newConcept: ApiConceptType) => transformApiToCleanConcept(newConcept, concept.language));

export const deleteLanguageVersionConcept = async (
  conceptId: number,
  language: string,
): Promise<ApiConceptType> =>
  fetchAuthorized(`${draftConceptUrl}/${conceptId}?language=${language}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);

export const fetchStatusStateMachine = async (): Promise<ConceptStatusStateMachineType> =>
  fetchAuthorized(`${draftConceptUrl}/status-state-machine/`).then(resolveJsonOrRejectWithError);

export const updateConceptStatus = async (
  id: number,
  status: ConceptStatusType,
): Promise<ApiConceptType> =>
  fetchAuthorized(`${draftConceptUrl}/${id}/status/${status}`, {
    method: 'PUT',
  }).then(resolveJsonOrRejectWithError);

export const searchConcepts = async (query: ConceptQuery): Promise<ConceptSearchResult> =>
  fetchAuthorized(`${draftConceptUrl}/?${queryString.stringify(query)}`).then(
    resolveJsonOrRejectWithError,
  );
