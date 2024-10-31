/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  IConcept,
  IDraftConceptSearchParams,
  IConceptSearchResult,
  ITagsSearchResult,
} from "@ndla/types-backend/concept-api";
import { fetchConcept, fetchSearchTags, fetchStatusStateMachine, postSearchConcepts } from "./conceptApi";
import { StringSort } from "../../containers/SearchPage/components/form/SearchForm";
import { ConceptStatusStateMachineType } from "../../interfaces";
import { CONCEPT, CONCEPT_SEARCH_TAGS, CONCEPT_STATE_MACHINE, SEARCH_CONCEPTS } from "../../queryKeys";

export interface UseConcept {
  id: number;
  language?: string;
}

export const conceptQueryKeys = {
  concept: (params?: Partial<UseConcept>) => [CONCEPT, params] as const,
  searchConcepts: (params?: Partial<StringSort<IDraftConceptSearchParams>>) => [SEARCH_CONCEPTS, params] as const,
  statusStateMachine: [CONCEPT_STATE_MACHINE] as const,
  conceptSearchTags: (params?: Partial<UseSearchTags>) => [CONCEPT_SEARCH_TAGS, params] as const,
};

export const useConcept = (params: UseConcept, options?: Partial<UseQueryOptions<IConcept>>) => {
  return useQuery<IConcept>({
    queryKey: conceptQueryKeys.concept(params),
    queryFn: () => fetchConcept(params.id, params.language),
    ...options,
  });
};

export const useSearchConcepts = (
  query: StringSort<IDraftConceptSearchParams>,
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

interface UseSearchTags {
  input: string;
  language: string;
}

export const useConceptSearchTags = (params: UseSearchTags, options?: Partial<UseQueryOptions<ITagsSearchResult>>) => {
  return useQuery<ITagsSearchResult>({
    queryKey: conceptQueryKeys.conceptSearchTags(params),
    queryFn: () => fetchSearchTags(params.input, params.language),
    ...options,
  });
};
