/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useQuery, UseQueryOptions } from 'react-query';
import {
  IConcept as ConceptApiType,
  IConceptSearchResult as ConceptSearchResult,
} from '@ndla/types-concept-api';
import { CONCEPT, CONCEPT_STATE_MACHINE, SEARCH_CONCEPTS } from '../../queryKeys';
import { fetchConcept, fetchStatusStateMachine, searchConcepts } from './conceptApi';
import { ConceptQuery } from './conceptApiInterfaces';

export const useConcept = (
  id: string | number,
  language?: string,
  options?: UseQueryOptions<ConceptApiType>,
) => {
  return useQuery<ConceptApiType>(
    [CONCEPT, id, language],
    () => fetchConcept(id, language),
    options,
  );
};
export const useSearchConcepts = (
  query: ConceptQuery,
  options?: UseQueryOptions<ConceptSearchResult>,
) =>
  useQuery<ConceptSearchResult>(
    [SEARCH_CONCEPTS, queryString.stringify(query)],
    () => searchConcepts(query),
    options,
  );

export const useConceptStateMachine = (
  options?: UseQueryOptions<Record<string, string[]>>,
) => {
  return useQuery<Record<string, string[]>>(
    [CONCEPT_STATE_MACHINE],
    () => fetchStatusStateMachine(),
    options,
  );
};
