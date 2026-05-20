/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DraftConceptSearchParamsDTO } from "@ndla/types-backend/concept-api";
import { queryOptions } from "@tanstack/react-query";
import { CONCEPT, CONCEPT_SEARCH_TAGS, CONCEPT_STATE_MACHINE, SEARCH_CONCEPTS } from "../../queryKeys";
import { fetchConcept, fetchSearchTags, fetchStatusStateMachine, postSearchConcepts } from "./conceptApi";

export interface UseConcept {
  id: number;
  language?: string;
}

export const conceptQueryKeys = {
  concept: (params?: Partial<UseConcept>) => [CONCEPT, params] as const,
  searchConcepts: (params?: Partial<DraftConceptSearchParamsDTO>) => [SEARCH_CONCEPTS, params] as const,
  statusStateMachine: [CONCEPT_STATE_MACHINE] as const,
  conceptSearchTags: (params?: Partial<UseSearchTags>) => [CONCEPT_SEARCH_TAGS, params] as const,
};

export const conceptQueryOptions = (params: UseConcept) => {
  return queryOptions({
    queryKey: conceptQueryKeys.concept(params),
    queryFn: () => fetchConcept(params.id, params.language),
  });
};

export const searchConceptsQueryOptions = (query: DraftConceptSearchParamsDTO) => {
  return queryOptions({
    queryKey: conceptQueryKeys.searchConcepts(query),
    queryFn: () => postSearchConcepts(query),
  });
};

export const conceptStateMachineQueryOptions = () => {
  return queryOptions({
    queryKey: conceptQueryKeys.statusStateMachine,
    queryFn: fetchStatusStateMachine,
    staleTime: Infinity,
  });
};

interface UseSearchTags {
  input: string;
  language: string;
}

export const conceptSearchTagsQueryOptions = (params: UseSearchTags) => {
  return queryOptions({
    queryKey: conceptQueryKeys.conceptSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
  });
};
