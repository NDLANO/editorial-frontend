/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchSubjects } from '.';
import { WithTaxonomyVersion } from '../../../interfaces';
import { SUBJECTS } from '../../../queryKeys';
import { SubjectType } from '../taxonomyApiInterfaces';

interface UseSubjectsParams extends WithTaxonomyVersion {
  language: string;
  metadataFilter?: { key: string; value?: string };
}

export const subjectsQueryKey = (params?: Partial<UseSubjectsParams>) => [SUBJECTS, params];

export const useSubjects = (
  params: UseSubjectsParams,
  options?: UseQueryOptions<SubjectType[]>,
) => {
  return useQuery<SubjectType[]>(subjectsQueryKey(params), () => fetchSubjects(params), options);
};
