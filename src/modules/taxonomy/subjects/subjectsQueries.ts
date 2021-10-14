import queryString from 'query-string';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import {
  addSubject,
  addSubjectTopic,
  deleteSubject,
  deleteSubjectNameTranslation,
  fetchSubject,
  fetchSubjectNameTranslations,
  fetchSubjects,
  fetchSubjectTopics,
  updateSubjectMetadata,
  updateSubjectNameTranslation,
  updateSubjectTopic,
} from '.';
import { SUBJECT, SUBJECTS, SUBJECT_NAME_TRANSLATIONS, SUBJECT_TOPICS } from '../../../queryKeys';
import {
  SubjectTopic,
  SubjectType,
  TaxNameTranslation,
  TaxonomyMetadata,
} from '../taxonomyApiInterfaces';
import handleError from '../../../util/handleError';
import { LocaleType } from '../../../interfaces';
import { SubjectTopicPutBody } from '../topics/topicInterfaces';
import { SubjectTopicPostBody } from './subjectInterfaces';

export const useUpdateSubjectMetadata = () => {
  const qc = useQueryClient();
  return useMutation<
    TaxonomyMetadata,
    unknown,
    { id: string; metadata: Partial<TaxonomyMetadata> }
  >(data => updateSubjectMetadata(data.id, data.metadata), {
    onSettled: () => {
      qc.invalidateQueries(SUBJECTS);
    },
  });
};

export const useSubjectNameTranslations = (
  id: string,
  options?: UseQueryOptions<TaxNameTranslation[]>,
) => {
  return useQuery<TaxNameTranslation[]>(
    [SUBJECT_NAME_TRANSLATIONS, id],
    () => fetchSubjectNameTranslations(id),
    options,
  );
};

export const useDeleteSubjectNameTranslation = () => {
  return useMutation<void, unknown, { subjectId: string; locale: LocaleType }>(data =>
    deleteSubjectNameTranslation(data.subjectId, data.locale),
  );
};

export const useUpdateSubjectNameTranslation = () => {
  return useMutation<void, unknown, { subjectId: string; locale: LocaleType; name: string }>(data =>
    updateSubjectNameTranslation(data.subjectId, data.locale, data.name),
  );
};

export const useUpdateSubjectTopic = (
  options?: UseMutationOptions<void, unknown, { id: string; body: SubjectTopicPutBody }>,
) => {
  return useMutation<void, unknown, { id: string; body: SubjectTopicPutBody }>(
    data => updateSubjectTopic(data.id, data.body),
    options,
  );
};

export const useSubjectTopics = (
  id: string,
  language: string,
  options?: UseQueryOptions<SubjectTopic[]>,
) =>
  useQuery<SubjectTopic[]>(
    [SUBJECT_TOPICS, id, language],
    () => fetchSubjectTopics(id, language),
    options,
  );

export const useAddSubjectTopic = (
  options?: UseMutationOptions<string, unknown, SubjectTopicPostBody>,
) => {
  return useMutation<string, unknown, SubjectTopicPostBody>(data => addSubjectTopic(data));
};

export const useDeleteSubjectMutation = () => {
  const qc = useQueryClient();
  return useMutation<void, unknown, string>(id => deleteSubject(id), {
    onMutate: async id => {
      await qc.cancelQueries(SUBJECTS);
      const prevSubjects = qc.getQueryData<SubjectType[]>(SUBJECTS) ?? [];
      const withoutDeleted = prevSubjects.filter(s => s.id !== id);
      qc.setQueryData<SubjectType[]>(SUBJECTS, withoutDeleted);
    },
    onSettled: () => qc.invalidateQueries(SUBJECTS),
  });
};

export const useAddSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<string, undefined, { contentUri?: string; id?: string; name: string }>(
    data => addSubject(data),
    {
      onMutate: async newSubject => {
        await queryClient.cancelQueries(SUBJECTS);
        const previousSubjects = queryClient.getQueryData<SubjectType[]>(SUBJECTS) ?? [];
        const optimisticSubject: SubjectType = {
          ...newSubject,
          contentUri: newSubject.contentUri ?? '',
          id: newSubject.id ?? '',
          path: '',
          metadata: { visible: true, grepCodes: [], customFields: {} },
        };
        queryClient.setQueryData<SubjectType[]>(SUBJECTS, [...previousSubjects, optimisticSubject]);
        return previousSubjects;
      },
      onError: e => handleError(e),
      onSettled: () => queryClient.invalidateQueries(SUBJECTS),
    },
  );
};

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

export const useSubject = (
  id: string,
  language?: string,
  options?: UseQueryOptions<SubjectType>,
) => {
  const qc = useQueryClient();
  return useQuery<SubjectType>([SUBJECT, id, language], () => fetchSubject(id, language), {
    placeholderData: qc.getQueryData<SubjectType[]>(SUBJECTS)?.find(s => s.id === id),
    ...options,
  });
};
