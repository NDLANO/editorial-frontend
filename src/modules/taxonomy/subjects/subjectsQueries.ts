/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useQuery, UseQueryOptions } from 'react-query';
import { fetchSubject, fetchSubjects } from '.';
import { WithTaxonomyVersion } from '../../../interfaces';
import { SUBJECT, SUBJECTS } from '../../../queryKeys';
import { SubjectType } from '../taxonomyApiInterfaces';

interface UseSubjectsParams extends WithTaxonomyVersion {
  locale: string;
  metadataFilter?: { key: string; value?: string };
}

export const useSubjects = (
  { metadataFilter, locale, taxonomyVersion }: UseSubjectsParams,
  options?: UseQueryOptions<SubjectType[]>,
) => {
  const query = queryString.stringify({
    language: locale,
    key: metadataFilter?.key,
    value: metadataFilter?.value,
  });
  return useQuery<SubjectType[]>(
    [SUBJECTS, query, taxonomyVersion],
    () => fetchSubjects({ language: locale, metadataFilter: metadataFilter, taxonomyVersion }),
    options,
  );
};

interface UseSubjectParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

export const useSubject = (
  { id, language, taxonomyVersion }: UseSubjectParams,
  options: UseQueryOptions<SubjectType>,
) =>
  useQuery<SubjectType>(
    [SUBJECT, id, language, taxonomyVersion],
    () => fetchSubject({ id, language, taxonomyVersion }),
    options,
  );
