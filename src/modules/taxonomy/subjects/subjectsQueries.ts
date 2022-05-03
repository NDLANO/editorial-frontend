/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from 'react-query';
import { fetchSubject, fetchSubjects } from '.';
import { WithTaxonomyVersion } from '../../../interfaces';
import { SUBJECT, SUBJECTS } from '../../../queryKeys';
import { SubjectType } from '../taxonomyApiInterfaces';

interface UseSubjectsParams extends WithTaxonomyVersion {
  language: string;
  metadataFilter?: { key: string; value?: string };
}

export const subjectsQueryKey = (params?: UseSubjectsParams) => [SUBJECTS, params];

export const useSubjects = (
  params: UseSubjectsParams,
  options?: UseQueryOptions<SubjectType[]>,
) => {
  return useQuery<SubjectType[]>(subjectsQueryKey(params), () => fetchSubjects(params), options);
};

interface UseSubjectParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

export const subjectQueryKey = (params?: Partial<UseSubjectParams>) => [SUBJECT, params];

export const useSubject = (params: UseSubjectParams, options: UseQueryOptions<SubjectType>) =>
  useQuery<SubjectType>(subjectQueryKey(params), () => fetchSubject(params), options);
