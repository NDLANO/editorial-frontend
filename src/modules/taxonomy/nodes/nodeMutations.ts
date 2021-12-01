import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { NODES } from '../../../queryKeys';
import handleError from '../../../util/handleError';
import {
  deleteNode,
  deleteNodeConnection,
  deleteNodeTranslation,
  deleteResourceForNode,
  postNode,
  postNodeConnection,
  postResourceForNode,
  putNodeConnection,
  putNodeMetadata,
  putNodeTranslation,
  putResourceForNode,
} from './nodeApi';
import {
  NodeConnectionPostType,
  NodeConnectionPutType,
  NodeMetadata,
  NodePostPatchType,
  NodeResourcePostType,
  NodeResourcePutType,
  NodeTranslationPutType,
  NodeType,
} from './nodeApiTypes';

export const useAddNodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<string, undefined, NodePostPatchType>(data => postNode(data), {
    onMutate: async newNode => {
      await queryClient.cancelQueries(NODES);
      const previousNodes = queryClient.getQueryData<NodeType[]>(NODES) ?? [];
      const optimisticNode: NodeType = {
        ...newNode,
        contentUri: newNode.contentUri ?? '',
        id: newNode.id ?? '',
        path: '',
        metadata: { visible: true, grepCodes: [], customFields: {} },
      };
      queryClient.setQueryData<NodeType[]>(NODES, [...previousNodes, optimisticNode]);
      return previousNodes;
    },
    onError: e => handleError(e),
    onSettled: () => queryClient.invalidateQueries(NODES),
  });
};

export const useUpdateNodeMetadataMutation = () => {
  const qc = useQueryClient();
  return useMutation<NodeMetadata, unknown, { id: string; metadata: Partial<NodeMetadata> }>(
    data => putNodeMetadata(data.id, data.metadata),
    {
      onSettled: () => {
        qc.invalidateQueries(NODES);
      },
    },
  );
};

export const useDeleteNodeMutation = () => {
  const qc = useQueryClient();
  return useMutation<void, unknown, string>(id => deleteNode(id), {
    onMutate: async id => {
      await qc.cancelQueries(NODES);
      const prevNodes = qc.getQueryData<NodeType[]>(NODES) ?? [];
      const withoutDeleted = prevNodes.filter(s => s.id !== id);
      qc.setQueryData<NodeType[]>(NODES, withoutDeleted);
    },
    onSettled: () => qc.invalidateQueries(NODES),
  });
};

export const useDeleteNodeTranslationMutation = () => {
  return useMutation<void, unknown, { subjectId: string; locale: string }>(data =>
    deleteNodeTranslation(data.subjectId, data.locale),
  );
};

export const useUpdateNodeTranslationMutation = () => {
  return useMutation<
    void,
    unknown,
    { id: string; locale: string; newTranslation: NodeTranslationPutType }
  >(data => putNodeTranslation(data.id, data.locale, data.newTranslation));
};

export const useDeleteNodeConnectionMutation = (
  options?: UseMutationOptions<void, unknown, { id: string }>,
) => {
  return useMutation<void, unknown, { id: string }>(data => deleteNodeConnection(data.id), options);
};

export const useUpdateNodeConnectionMutation = (
  options?: UseMutationOptions<void, unknown, { id: string; body: NodeConnectionPutType }>,
) => {
  return useMutation<void, unknown, { id: string; body: NodeConnectionPutType }>(
    data => putNodeConnection(data.id, data.body),
    options,
  );
};

export const usePostNodeConnectionMutation = (
  options?: UseMutationOptions<string, unknown, { body: NodeConnectionPostType }>,
) => {
  return useMutation<string, unknown, { body: NodeConnectionPostType }>(
    data => postNodeConnection(data.body),
    options,
  );
};

export const usePostResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, { body: NodeResourcePostType }>,
) => {
  return useMutation<void, unknown, { body: NodeResourcePostType }>(
    data => postResourceForNode(data.body),
    options,
  );
};

export const useDeleteResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, { id: string }>,
) => {
  return useMutation<void, unknown, { id: string }>(
    data => deleteResourceForNode(data.id),
    options,
  );
};

export const usePutResourceForNodeMutation = (
  options?: UseMutationOptions<void, unknown, { id: string; body: NodeResourcePutType }>,
) => {
  return useMutation<void, unknown, { id: string; body: NodeResourcePutType }>(
    data => putResourceForNode(data.id, data.body),
    options,
  );
};
