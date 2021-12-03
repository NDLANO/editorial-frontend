/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useQuery, UseQueryOptions } from 'react-query';
import { CONCEPT_STATE_MACHINE, SEARCH_CONCEPTS } from '../../queryKeys';
import { fetchStatusStateMachine, searchConcepts } from './conceptApi';
import {
  ConceptQuery,
  ConceptSearchResult,
  ConceptStatusStateMachineType,
} from './conceptApiInterfaces';

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
  options?: UseQueryOptions<ConceptStatusStateMachineType>,
) => {
  return useQuery<ConceptStatusStateMachineType>(
    [CONCEPT_STATE_MACHINE],
    () => fetchStatusStateMachine(),
    options,
  );
};
