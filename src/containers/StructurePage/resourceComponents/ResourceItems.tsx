/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { DropResult } from 'react-beautiful-dnd';
import sortBy from 'lodash/sortBy';
import styled from '@emotion/styled';
import { ModalV2 } from '@ndla/modal';
import Resource from './Resource';
import handleError from '../../../util/handleError';
import { usePutResourceForNodeMutation } from '../../../modules/nodes/nodeMutations';
import { ResourceWithNodeConnection } from '../../../modules/nodes/nodeApiTypes';
import MakeDndList from '../../../components/MakeDndList';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import {
  NodeResourceMeta,
  resourcesWithNodeConnectionQueryKey,
} from '../../../modules/nodes/nodeQueries';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';
import { Auth0UserData, Dictionary } from '../../../interfaces';
import RemoveResource from './RemoveResource';

const StyledResourceItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

interface Props {
  resources: ResourceWithNodeConnectionAndMeta[];
  currentNodeId: string;
  contentMeta: Dictionary<NodeResourceMeta>;
  contentMetaLoading: boolean;
  users?: Dictionary<Auth0UserData>;
}

const ResourceItems = ({
  resources,
  currentNodeId,
  contentMeta,
  contentMetaLoading,
  users,
}: Props) => {
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [deleteResource, setDeleteResource] = useState<
    ResourceWithNodeConnectionAndMeta | undefined
  >(undefined);

  const qc = useQueryClient();
  const compKey = resourcesWithNodeConnectionQueryKey({
    id: currentNodeId,
    language: i18n.language,
    taxonomyVersion,
  });

  const onUpdateRank = async (id: string, newRank: number) => {
    await qc.cancelQueries(compKey);
    const prevData = qc.getQueryData<ResourceWithNodeConnection[]>(compKey) ?? [];
    const updated = prevData.map((r) => {
      if (r.connectionId === id) {
        return { ...r, rank: newRank };
      } else if (r.rank < newRank) {
        return r;
      } else return { ...r, rank: r.rank + 1 };
    });
    qc.setQueryData<ResourceWithNodeConnection[]>(compKey, sortBy(updated, ['rank']));
    return resources;
  };

  const { mutateAsync: updateNodeResource } = usePutResourceForNodeMutation({
    onMutate: ({ id, body }) => onUpdateRank(id, body.rank as number),
    onError: (e) => handleError(e),
    onSuccess: () => qc.invalidateQueries(compKey),
  });

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

  const toggleDelete = (resource: ResourceWithNodeConnectionAndMeta) => {
    setDeleteResource(resource);
  };

  return (
    <StyledResourceItems>
      <MakeDndList onDragEnd={onDragEnd} dragHandle disableDnd={false}>
        {resources.map((resource) => (
          <Resource
            responsible={
              users?.[contentMeta[resource.contentUri ?? '']?.responsible?.responsibleId ?? '']
                ?.name
            }
            currentNodeId={currentNodeId}
            id={resource.id}
            connectionId={resource.connectionId}
            resource={{
              ...resource,
              contentMeta: resource.contentUri ? contentMeta[resource.contentUri] : undefined,
            }}
            key={resource.id}
            onDelete={() => toggleDelete(resource)}
            contentMetaLoading={contentMetaLoading}
          />
        ))}
      </MakeDndList>
      <ModalV2 controlled isOpen={!!deleteResource} onClose={() => setDeleteResource(undefined)}>
        {(close) =>
          deleteResource && (
            <RemoveResource
              key={deleteResource.id}
              deleteResource={deleteResource}
              nodeId={currentNodeId}
              onClose={close}
            />
          )
        }
      </ModalV2>
    </StyledResourceItems>
  );
};

export default ResourceItems;
