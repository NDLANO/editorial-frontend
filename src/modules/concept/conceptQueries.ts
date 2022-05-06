/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import { IConcept, IConceptSearchResult } from '@ndla/types-concept-api';
import { CONCEPT, CONCEPT_STATE_MACHINE, SEARCH_CONCEPTS } from '../../queryKeys';
import { fetchConcept, fetchStatusStateMachine, searchConcepts } from './conceptApi';
import { ConceptQuery } from './conceptApiInterfaces';
import { ConceptStatusStateMachineType } from '../../interfaces';

export interface UseConcept {
  id: number;
  language?: string;
}

export const conceptQueryKey = (params?: Partial<UseConcept>) => [CONCEPT, params];

export const useConcept = (params: UseConcept, options?: UseQueryOptions<IConcept>) => {
  return useQuery<IConcept>(
    conceptQueryKey(params),
    () => fetchConcept(params.id, params.language),
    options,
  );
};

export const searchConceptsQueryKey = (params?: Partial<ConceptQuery>) => [SEARCH_CONCEPTS, params];

export const useSearchConcepts = (
  query: ConceptQuery,
  options?: UseQueryOptions<IConceptSearchResult>,
) =>
  useQuery<IConceptSearchResult>(
    searchConceptsQueryKey(query),
    () => searchConcepts(query),
    options,
  );

export const conceptStateMachineQueryKey = () => [CONCEPT_STATE_MACHINE];

export const useConceptStateMachine = (
  options?: UseQueryOptions<ConceptStatusStateMachineType>,
) => {
  return useQuery<ConceptStatusStateMachineType>(
    conceptStateMachineQueryKey(),
    () => fetchStatusStateMachine(),
    options,
  );
};
