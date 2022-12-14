/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { fonts } from '@ndla/core';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';
import { ChildNodeType } from '../../../modules/nodes/nodeApiTypes';
import Resource from './Resource';
import { NodeResourceMeta } from '../../../modules/nodes/nodeQueries';

const ResourceGroupBanner = styled.div`
  background-color: ${colors.brand.lighter};
  border-radius: 10px;
  ${fonts.sizes(16)};
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  padding: 10px;
`;

interface Props {
  nodeResources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: ResourceType[];
  currentNode: ChildNodeType;
  contentMeta?: NodeResourceMeta;
}

const AllResourcesGroup = ({ resourceTypes, nodeResources, currentNode, contentMeta }: Props) => {
  const { t } = useTranslation();
  const [displayResource, setDisplayResource] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const resourceTypesWithoutMissing = resourceTypes
    .filter(rt => rt.id !== 'missing')
    .map(rt => ({ id: rt.id, name: rt.name }));

  const currentNodeId = currentNode.id;

  const toggleDisplayResource = () => setDisplayResource(prev => !prev);
  // TODO: this should be included
  const toggleAddModal = () => setShowAddModal(prev => !prev);

  return (
    <>
      <ResourceGroupBanner>{currentNode.name}</ResourceGroupBanner>

      {false && (
        <AddResourceModal
          resourceTypes={resourceTypesWithoutMissing}
          nodeId={currentNodeId}
          onClose={() => setShowAddModal(false)}
          existingResourceIds={nodeResources.map(r => r.id)}
        />
      )}
      {currentNode.name && (
        <Resource
          currentNodeId={currentNode.id}
          resource={{
            ...currentNode,
            paths: currentNode.paths ?? [],
            nodeId: '',
            contentMeta,
            resourceTypes: [],
            relevanceId: currentNode.relevanceId!,
          }}
        />
      )}
      <ResourceItems resources={nodeResources} currentNodeId={currentNodeId} />
    </>
  );
};

export default AllResourcesGroup;
