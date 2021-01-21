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
import {
  ConceptApiType,
  ConceptStatusStateMashineType,
  ConceptStatusType,
  ConceptTagsSearchResult,
  ConceptQuery,
  ConceptSearchResult,
} from './conceptApiInterfaces';
import { ConceptType, StrippedConceptType } from '../../interfaces';

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
): Promise<ConceptType> => {
  const response = await fetchAuthorized(
    `${draftConceptUrl}/${conceptId}?language=${locale}&fallback=true`,
  );
  return resolveJsonOrRejectWithError(
    response,
  ).then((resolved: ConceptApiType) =>
    transformApiToCleanConcept(resolved, locale),
  );
};

export const addConcept = async (
  concept: StrippedConceptType,
): Promise<ConceptType> =>
  fetchAuthorized(`${draftConceptUrl}/`, {
    method: 'POST',
    body: JSON.stringify(concept),
  })
    .then(resolveJsonOrRejectWithError)
    .then((newConcept: ConceptApiType) =>
      transformApiToCleanConcept(newConcept, concept.language),
    );

export const updateConcept = async (
  concept: StrippedConceptType,
): Promise<ConceptType> =>
  fetchAuthorized(`${draftConceptUrl}/${concept.id}`, {
    method: 'PATCH',
    body: JSON.stringify(concept),
  })
    .then(resolveJsonOrRejectWithError)
    .then((newConcept: ConceptApiType) =>
      transformApiToCleanConcept(newConcept, concept.language),
    );

export const deleteLanguageVersionConcept = async (
  conceptId: number,
  language: string,
): Promise<ConceptApiType> =>
  fetchAuthorized(`${draftConceptUrl}/${conceptId}?language=${language}`, {
    method: 'DELETE',
  }).then(resolveJsonOrRejectWithError);

export const fetchStatusStateMachine = async (): Promise<ConceptStatusStateMashineType> =>
  fetchAuthorized(`${draftConceptUrl}/status-state-machine/`).then(
    resolveJsonOrRejectWithError,
  );

export const updateConceptStatus = async (
  id: number,
  status: ConceptStatusType,
): Promise<ConceptApiType> =>
  fetchAuthorized(`${draftConceptUrl}/${id}/status/${status}`, {
    method: 'PUT',
  }).then(resolveJsonOrRejectWithError);

export const searchConcepts = async (
  query: ConceptQuery,
): Promise<ConceptSearchResult> =>
  fetchAuthorized(`${draftConceptUrl}/search/`, {
    method: 'POST',
    body: JSON.stringify(query),
  }).then(resolveJsonOrRejectWithError);
