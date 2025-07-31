/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  IConceptDTO,
  IDraftConceptSearchParamsDTO,
  IConceptSearchResultDTO,
  ITagsSearchResultDTO,
} from "@ndla/types-backend/concept-api";
import { fetchConcept, fetchSearchTags, fetchStatusStateMachine, postSearchConcepts } from "./conceptApi";
import { ConceptStatusStateMachineType, StringSort } from "../../interfaces";
import { CONCEPT, CONCEPT_SEARCH_TAGS, CONCEPT_STATE_MACHINE, SEARCH_CONCEPTS } from "../../queryKeys";

export interface UseConcept {
  id: number;
  language?: string;
}

export const conceptQueryKeys = {
  concept: (params?: Partial<UseConcept>) => [CONCEPT, params] as const,
  searchConcepts: (params?: Partial<StringSort<IDraftConceptSearchParamsDTO>>) => [SEARCH_CONCEPTS, params] as const,
  statusStateMachine: [CONCEPT_STATE_MACHINE] as const,
  conceptSearchTags: (params?: Partial<UseSearchTags>) => [CONCEPT_SEARCH_TAGS, params] as const,
};

export const useConcept = (params: UseConcept, options?: Partial<UseQueryOptions<IConceptDTO>>) => {
  return useQuery<IConceptDTO>({
    queryKey: conceptQueryKeys.concept(params),
    queryFn: () => fetchConcept(params.id, params.language),
    ...options,
  });
};

export const useSearchConcepts = (
  query: StringSort<IDraftConceptSearchParamsDTO>,
  options?: Partial<UseQueryOptions<IConceptSearchResultDTO>>,
) => {
  return useQuery<IConceptSearchResultDTO>({
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

interface UseSearchTags {
  input: string;
  language: string;
}

export const useConceptSearchTags = (
  params: UseSearchTags,
  options?: Partial<UseQueryOptions<ITagsSearchResultDTO>>,
) => {
  return useQuery<ITagsSearchResultDTO>({
    queryKey: conceptQueryKeys.conceptSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
    ...options,
  });
};
