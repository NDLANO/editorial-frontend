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
  NewConceptType,
  PatchConceptType,
  ApiConceptType,
  ConceptStatusType,
  ConceptType,
  ConceptSearchResult,
} from './conceptApiInterfaces';

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

export const fetchConcept = async (conceptId: number, locale: string): Promise<ApiConceptType> => {
  return fetchAuthorized(
    `${draftConceptUrl}/${conceptId}?language=${locale}&fallback=true`,
  ).then(r => resolveJsonOrRejectWithError<ApiConceptType>(r));
};

export const addConcept = async (concept: NewConceptType): Promise<ConceptType> =>
  fetchAuthorized(`${draftConceptUrl}/`, {
    method: 'POST',
    body: JSON.stringify(concept),
  })
    .then(r => resolveJsonOrRejectWithError<ApiConceptType>(r))
    .then((newConcept: ApiConceptType) => transformApiToCleanConcept(newConcept, concept.language));

export const updateConcept = async (concept: PatchConceptType): Promise<ConceptType> =>
  fetchAuthorized(`${draftConceptUrl}/${concept.id}`, {
    method: 'PATCH',
    body: JSON.stringify(concept),
  })
    .then(r => resolveJsonOrRejectWithError<ApiConceptType>(r))
    .then((newConcept: ApiConceptType) => transformApiToCleanConcept(newConcept, concept.language));

export const deleteLanguageVersionConcept = async (
  conceptId: number,
  language: string,
): Promise<ApiConceptType> =>
  fetchAuthorized(`${draftConceptUrl}/${conceptId}?language=${language}`, {
    method: 'DELETE',
  }).then(r => resolveJsonOrRejectWithError<ApiConceptType>(r));

export const fetchStatusStateMachine = async (): Promise<ConceptStatusStateMachineType> =>
  fetchAuthorized(`${draftConceptUrl}/status-state-machine/`).then(r =>
    resolveJsonOrRejectWithError<ConceptStatusStateMachineType>(r),
  );

export const updateConceptStatus = async (
  id: number,
  status: ConceptStatusType,
): Promise<ApiConceptType> =>
  fetchAuthorized(`${draftConceptUrl}/${id}/status/${status}`, {
    method: 'PUT',
  }).then(r => resolveJsonOrRejectWithError<ApiConceptType>(r));

export const searchConcepts = async (query: ConceptQuery): Promise<ConceptSearchResult> =>
  fetchAuthorized(`${draftConceptUrl}/?${queryString.stringify(query)}`).then(r =>
    resolveJsonOrRejectWithError<ConceptSearchResult>(r),
  );
