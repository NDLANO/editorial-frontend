import { useMutation, useQueryClient } from 'react-query';
import { createTopicResource, deleteTopicResource } from '.';
import { TOPIC_RESOURCES } from '../../../queryKeys';
import { TopicResourcePostType } from './topicResourceInterfaces';
import handleError from '../../../util/handleError';

export const useCreateTopicResource = () => {
  const qc = useQueryClient();
  return useMutation<string, unknown, TopicResourcePostType>(data => createTopicResource(data), {
    onSettled: (_, __, data) => qc.invalidateQueries([TOPIC_RESOURCES, data.topicid]),
    onError: e => handleError(e),
  });
};

export const useDeleteTopicResource = () => {
  return useMutation<void, unknown, string>(id => deleteTopicResource(id), {
    onError: e => handleError(e),
  });
};
