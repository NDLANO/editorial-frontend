/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useQuery, UseQueryOptions } from 'react-query';
import { SEARCH_CONCEPTS } from '../../queryKeys';
import { searchConcepts } from './conceptApi';
import { ConceptQuery, ConceptSearchResult } from './conceptApiInterfaces';

export const useSearchConcepts = (
  query: ConceptQuery,
  options?: UseQueryOptions<ConceptSearchResult>,
) =>
  useQuery<ConceptSearchResult>(
    [SEARCH_CONCEPTS, queryString.stringify(query)],
    () => searchConcepts(query),
    options,
  );
