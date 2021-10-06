import queryString from 'query-string';
import { useQuery, UseQueryOptions } from 'react-query';
import { fetchSubject, fetchSubjects } from '.';
import { SUBJECT, SUBJECTS } from '../../../queryKeys';
import { SubjectType } from '../taxonomyApiInterfaces';

export const useSubjects = (
  locale: string,
  metadataFilter?: { key: string; value?: string },
  options?: UseQueryOptions<SubjectType[]>,
) => {
  const query = queryString.stringify({
    language: locale,
    key: metadataFilter?.key,
    value: metadataFilter?.value,
  });
  return useQuery<SubjectType[]>(
    [SUBJECTS, query],
    () => fetchSubjects(locale, metadataFilter),
    options,
  );
};

export const useSubject = (id: string, language?: string, options?: UseQueryOptions<SubjectType>) =>
  useQuery<SubjectType>([SUBJECT, id, language], () => fetchSubject(id, language), options);
