/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { DropResult } from 'react-beautiful-dnd';
import { partition, sortBy, uniqBy } from 'lodash';
import styled from '@emotion/styled';
import Resource from './Resource';
import handleError from '../../../util/handleError';
import {
  useDeleteResourceForNodeMutation,
  usePutResourceForNodeMutation,
} from '../../../modules/nodes/nodeMutations';
import { RESOURCES_WITH_NODE_CONNECTION } from '../../../queryKeys';
import { ResourceWithNodeConnection } from '../../../modules/nodes/nodeApiTypes';
import AlertModal from '../../../components/AlertModal';
import { classes } from './ResourceGroup';
import MakeDndList from '../../../components/MakeDndList';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

const StyledResourceItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledErrorMessage = styled.div`
  text-align: center;
`;

interface Props {
  resources: ResourceWithNodeConnection[];
  currentNodeId: string;
}

const isError = (error: unknown): error is Error => (error as Error).message !== undefined;

const ResourceItems = ({ resources, currentNodeId }: Props) => {
  const { t, i18n } = useTranslation();
  const [deleteId, setDeleteId] = useState<string>('');
  const { taxonomyVersion } = useTaxonomyVersion();

  const qc = useQueryClient();
  const compKey = [RESOURCES_WITH_NODE_CONNECTION, currentNodeId, { language: i18n.language }];
  const deleteNodeResource = useDeleteResourceForNodeMutation({
    onMutate: async ({ id }) => {
      await qc.cancelQueries(compKey);
      const prevData = qc.getQueryData<ResourceWithNodeConnection[]>(compKey) ?? [];
      const withoutDeleted = prevData.filter(res => res.connectionId !== id);
      qc.setQueryData<ResourceWithNodeConnection[]>(compKey, withoutDeleted);
      return prevData;
    },
  });

  const onUpdateRank = async (id: string, newRank: number) => {
    await qc.cancelQueries(compKey);
    const [toUpdate, other] = partition(resources, t => t.connectionId === id);
    const updatedRes: ResourceWithNodeConnection = { ...toUpdate[0], rank: newRank };
    const prevData = qc.getQueryData<ResourceWithNodeConnection[]>(compKey) ?? [];
    const updated = other.map(t => (t.rank >= updatedRes.rank ? { ...t, rank: t.rank + 1 } : t));
    const newArr = sortBy([...updated, updatedRes], 'rank');
    const allResources = uniqBy<ResourceWithNodeConnection>([...newArr, ...prevData], 'id');
    qc.setQueryData<ResourceWithNodeConnection[]>(compKey, allResources);
    return resources;
  };

  const { mutateAsync: updateNodeResource } = usePutResourceForNodeMutation({
    onMutate: ({ id, body }) => onUpdateRank(id, body.rank as number),
    onError: e => handleError(e),
    onSuccess: () => qc.invalidateQueries(compKey),
  });

  const onDelete = async (deleteId: string) => {
    setDeleteId('');
    await deleteNodeResource.mutateAsync(
      { id: deleteId, taxonomyVersion },
      { onSuccess: () => qc.invalidateQueries(compKey) },
    );
  };

  const onDragEnd = async ({ destination, source }: DropResult) => {
    if (!destination) return;
    const { connectionId, primary, relevanceId, rank: currentRank } = resources[source.index];
    const { rank } = resources[destination.index];
    if (currentRank === rank) {
      return;
    }
    await updateNodeResource({
      id: connectionId,
      body: {
        primary,
        rank: currentRank > rank ? rank : rank + 1,
        relevanceId,
      },
      taxonomyVersion,
    });
  };

  const toggleDelete = (newDeleteId: string) => {
    setDeleteId(newDeleteId);
  };

  return (
    <StyledResourceItems {...classes('list')}>
      <MakeDndList onDragEnd={onDragEnd} dragHandle disableDnd={false}>
        {resources.map(resource => (
          <Resource
            currentNodeId={currentNodeId}
            id={resource.id}
            connectionId={resource.connectionId}
            resource={resource}
            key={resource.id}
            onDelete={toggleDelete}
          />
        ))}
      </MakeDndList>
      {deleteNodeResource.error && isError(deleteNodeResource.error) && (
        <StyledErrorMessage data-testid="inlineEditErrorMessage" {...classes('errorMessage')}>
          {`${t('taxonomy.errorMessage')}: ${deleteNodeResource.error.message}`}
        </StyledErrorMessage>
      )}
      <AlertModal
        show={!!deleteId}
        text={t('taxonomy.resource.confirmDelete')}
        actions={[
          {
            text: t('form.abort'),
            onClick: () => toggleDelete(''),
          },
          {
            text: t('alertModal.delete'),
            onClick: () => onDelete(deleteId!),
          },
        ]}
        onCancel={() => toggleDelete('')}
      />
    </StyledResourceItems>
  );
};

export default memo(ResourceItems);
