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
  ConceptApiType,
  ConceptSearchResult,
  ConceptStatusStateMashineType,
  ConceptStatusType,
  ConceptTagsSearchResult,
  ConceptQuery,
  NewConceptType,
  UpdatedConceptType,
} from './conceptApiInterfaces';

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

export const fetchAllConcepts = async (locale: string): Promise<ConceptSearchResult> => {
  const response = await fetchAuthorized(`${draftConceptUrl}?language=${locale}`);
  return resolveJsonOrRejectWithError(response);
};

export const fetchConcept = async (conceptId: number, locale: string): Promise<ConceptApiType> => {
  const response = await fetchAuthorized(
    `${draftConceptUrl}/${conceptId}?language=${locale}&fallback=true`,
  );
  return resolveJsonOrRejectWithError(response);
};

export const addConcept = async (concept: NewConceptType): Promise<ConceptApiType> =>
  fetchAuthorized(`${draftConceptUrl}/`, {
    method: 'POST',
    body: JSON.stringify(concept),
  }).then(resolveJsonOrRejectWithError);

export const updateConcept = async (concept: UpdatedConceptType): Promise<ConceptApiType> =>
  fetchAuthorized(`${draftConceptUrl}/${concept.id}`, {
    method: 'PATCH',
    body: JSON.stringify(concept),
  }).then(resolveJsonOrRejectWithError);

export const deleteLanguageVersionConcept = async (
  conceptId: number,
  language: string,
): Promise<ConceptApiType> =>
  fetchAuthorized(`${draftConceptUrl}/${conceptId}?language=${language}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);

export const fetchStatusStateMachine = async (): Promise<ConceptStatusStateMashineType> =>
  fetchAuthorized(`${draftConceptUrl}/status-state-machine/`).then(resolveJsonOrRejectWithError);

export const updateConceptStatus = async (
  id: number,
  status: keyof typeof ConceptStatusType,
): Promise<ConceptApiType> =>
  fetchAuthorized(`${draftConceptUrl}/${id}/status/${status}`, {
    method: 'PUT',
  }).then(resolveJsonOrRejectWithError);

export const searchConcepts = async (query: ConceptQuery): Promise<ConceptSearchResult> =>
  fetchAuthorized(`${draftConceptUrl}/?${queryString.stringify(query)}`).then(
    resolveJsonOrRejectWithError,
  );
