/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import {
  deleteSubTopicConnection,
  deleteTopic,
  deleteTopicConnection,
  fetchTopic,
  fetchTopicConnections,
  fetchTopicResources,
  fetchTopics,
  updateTopicMetadata,
  updateTopicSubtopic,
} from '.';
import { deleteTopicResource, updateTopicResource } from '..';
import { TopicResource } from '../../../containers/StructurePage/resourceComponents/StructureResources';
import {
  SUBJECT_TOPICS_WITH_ARTICLE_TYPE,
  TOPIC,
  TOPICS,
  TOPIC_CONNECTIONS,
  TOPIC_RESOURCES,
} from '../../../queryKeys';
import { TaxonomyMetadata, Topic, TopicConnections } from '../taxonomyApiInterfaces';
import { TopicSubtopicPutBody } from './topicInterfaces';

export const useDeleteTopic = () => {
  return useMutation<void, unknown, string>(id => deleteTopic(id));
};

export const useDeleteTopicConnection = (options?: UseMutationOptions<void, unknown, string>) => {
  return useMutation<void, unknown, string>(id => deleteTopicConnection(id), options);
};

export const useDeleteSubTopicConnection = (
  options?: UseMutationOptions<void, unknown, string>,
) => {
  return useMutation<void, unknown, string>(id => deleteSubTopicConnection(id), options);
};

export const useTopicConnections = (id: string) => {
  return useQuery<TopicConnections[]>([TOPIC_CONNECTIONS, id], () => fetchTopicConnections(id));
};

export const useTopics = (language?: string, options?: UseQueryOptions<Topic[]>) => {
  return useQuery<Topic[]>([TOPICS, language], () => fetchTopics(language), options);
};

export const useTopic = (id: string, language?: string, options?: UseQueryOptions<Topic>) => {
  return useQuery<Topic>([TOPIC, id, language], () => fetchTopic(id, language), options);
};

export const useTopicResources = <ReturnType = TopicResource[]>(
  topicId: string,
  language?: string,
  relevance?: string,
  options?: UseQueryOptions<TopicResource[], unknown, ReturnType>,
) => {
  return useQuery<TopicResource[], unknown, ReturnType>(
    [TOPIC_RESOURCES, topicId, language, relevance],
    () => fetchTopicResources(topicId, language, relevance),
    options,
  );
};

export const useUpdateTopicSubTopic = (
  options?: UseMutationOptions<void, unknown, { body: TopicSubtopicPutBody; id: string }>,
) => {
  return useMutation<void, unknown, { body: TopicSubtopicPutBody; id: string }>(
    data => updateTopicSubtopic(data.id, data.body),
    options,
  );
};

export const useDeleteTopicResourceMutation = (
  options?: UseMutationOptions<void, unknown, string>,
) => {
  const qc = useQueryClient();
  return useMutation<void, unknown, string>(id => deleteTopicResource(id), {
    onSettled: (_, __, id) => {
      qc.invalidateQueries([TOPIC_RESOURCES, id]);
      qc.invalidateQueries(['topicResourcesWithStatusAndGrep', id]);
    },
    ...options,
  });
};

export const useUpdateTopicResource = (
  options?: UseMutationOptions<void, unknown, { id: string; body: any }>,
) => {
  return useMutation<void, unknown, { id: string; body: any }>(
    data => updateTopicResource(data.id, data.body),
    options,
  );
};

export const useTopicMetadataUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    TaxonomyMetadata,
    unknown,
    { id: string; metadata: Partial<TaxonomyMetadata> }
  >(data => updateTopicMetadata(data.id, data.metadata), {
    onSettled: (_, __, data) => queryClient.invalidateQueries([SUBJECT_TOPICS_WITH_ARTICLE_TYPE]),
  });
};
