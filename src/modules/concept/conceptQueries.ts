/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IConcept, IDraftConceptSearchParams, IConceptSearchResult } from "@ndla/types-backend/concept-api";
import { fetchConcept, fetchStatusStateMachine, postSearchConcepts } from "./conceptApi";
import { ConceptStatusStateMachineType } from "../../interfaces";
import { CONCEPT, CONCEPT_STATE_MACHINE, SEARCH_CONCEPTS } from "../../queryKeys";

export interface UseConcept {
  id: number;
  language?: string;
}

export const conceptQueryKeys = {
  concept: (params?: Partial<UseConcept>) => [CONCEPT, params] as const,
  searchConcepts: (params?: Partial<IDraftConceptSearchParams>) => [SEARCH_CONCEPTS, params] as const,
  statusStateMachine: [CONCEPT_STATE_MACHINE] as const,
};

export const useConcept = (params: UseConcept, options?: Partial<UseQueryOptions<IConcept>>) => {
  return useQuery<IConcept>({
    queryKey: conceptQueryKeys.concept(params),
    queryFn: () => fetchConcept(params.id, params.language),
    ...options,
  });
};

export const useSearchConcepts = (
  query: IDraftConceptSearchParams,
  options?: Partial<UseQueryOptions<IConceptSearchResult>>,
) => {
  return useQuery<IConceptSearchResult>({
    queryKey: conceptQueryKeys.searchConcepts(query),
    queryFn: () => postSearchConcepts(query),
    ...options,
  });
};

export const useConceptStateMachine = (options?: Partial<UseQueryOptions<ConceptStatusStateMachineType>>) => {
  return useQuery<ConceptStatusStateMachineType>({
    queryKey: conceptQueryKeys.statusStateMachine,
    queryFn: () => fetchStatusStateMachine(),
    ...options,
  });
};
