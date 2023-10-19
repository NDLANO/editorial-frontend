/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { IConcept, IConceptSearchResult } from '@ndla/types-backend/concept-api';
import { CONCEPT, CONCEPT_STATE_MACHINE, SEARCH_CONCEPTS } from '../../queryKeys';
import { fetchConcept, fetchStatusStateMachine, searchConcepts } from './conceptApi';
import { ConceptQuery } from './conceptApiInterfaces';
import { ConceptStatusStateMachineType } from '../../interfaces';

export interface UseConcept {
  id: number;
  language?: string;
}

export const conceptQueryKeys = {
  concept: (params?: Partial<UseConcept>) => [CONCEPT, params] as const,
  searchConcepts: (params?: Partial<ConceptQuery>) => [SEARCH_CONCEPTS, params] as const,
  statusStateMachine: [CONCEPT_STATE_MACHINE] as const,
};

export const useConcept = (params: UseConcept, options?: UseQueryOptions<IConcept>) => {
  return useQuery<IConcept>(
    conceptQueryKeys.concept(params),
    () => fetchConcept(params.id, params.language),
    options,
  );
};

export const useSearchConcepts = (
  query: ConceptQuery,
  options?: UseQueryOptions<IConceptSearchResult>,
) =>
  useQuery<IConceptSearchResult>(
    conceptQueryKeys.searchConcepts(query),
    () => searchConcepts(query),
    options,
  );

export const useConceptStateMachine = (
  options?: UseQueryOptions<ConceptStatusStateMachineType>,
) => {
  return useQuery<ConceptStatusStateMachineType>(
    conceptQueryKeys.statusStateMachine,
    () => fetchStatusStateMachine(),
    options,
  );
};
