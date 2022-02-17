/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import {
  IConcept as ConceptApiType,
  IConceptSearchResult as ConceptSearchResult,
  INewConcept,
  ITagsSearchResult as ConceptTagsSearchResult,
  IUpdatedConcept,
} from '@ndla/types-concept-api';
import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../util/apiHelpers';
import {
  ConceptStatusStateMachineType,
  ConceptQuery,
  ConceptStatusType,
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

export const fetchConcept = async (
  conceptId: string | number,
  locale?: string,
): Promise<ConceptApiType> => {
  const languageParam = locale ? `language=${locale}&` : '';
  return fetchAuthorized(`${draftConceptUrl}/${conceptId}?${languageParam}fallback=true`).then(r =>
    resolveJsonOrRejectWithError<ConceptApiType>(r),
  );
};

export const addConcept = async (concept: INewConcept): Promise<ConceptApiType> =>
  fetchAuthorized(`${draftConceptUrl}/`, {
    method: 'POST',
    body: JSON.stringify(concept),
  }).then(r => resolveJsonOrRejectWithError<ConceptApiType>(r));

export const updateConcept = async (
  id: number,
  concept: IUpdatedConcept,
): Promise<ConceptApiType> =>
  fetchAuthorized(`${draftConceptUrl}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(concept),
  }).then(r => resolveJsonOrRejectWithError<ConceptApiType>(r));

export const deleteLanguageVersionConcept = async (
  conceptId: number,
  language: string,
): Promise<ConceptApiType> =>
  fetchAuthorized(`${draftConceptUrl}/${conceptId}?language=${language}`, {
    method: 'DELETE',
  }).then(r => resolveJsonOrRejectWithError<ConceptApiType>(r));

export const fetchStatusStateMachine = async (): Promise<ConceptStatusStateMachineType> =>
  fetchAuthorized(`${draftConceptUrl}/status-state-machine/`).then(r =>
    resolveJsonOrRejectWithError<ConceptStatusStateMachineType>(r),
  );

export const updateConceptStatus = async (
  id: number,
  status: ConceptStatusType,
): Promise<ConceptApiType> =>
  fetchAuthorized(`${draftConceptUrl}/${id}/status/${status}`, {
    method: 'PUT',
  }).then(r => resolveJsonOrRejectWithError<ConceptApiType>(r));

export const searchConcepts = async (query: ConceptQuery): Promise<ConceptSearchResult> =>
  fetchAuthorized(`${draftConceptUrl}/?${queryString.stringify(query)}`).then(r =>
    resolveJsonOrRejectWithError<ConceptSearchResult>(r),
  );
