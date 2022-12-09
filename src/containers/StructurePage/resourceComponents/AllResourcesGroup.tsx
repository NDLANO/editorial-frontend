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

const ResourceGroupBanner = styled.div`
  background-color: ${colors.brand.lighter};
  border-radius: 10px;
  ${fonts.sizes(16)};
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  padding: 10px;
`;

interface Props {
  currentNodeId: string;
  nodeResources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: ResourceType[];
  topicName: string;
}

const AllResourcesGroup = ({ resourceTypes, nodeResources, currentNodeId, topicName }: Props) => {
  const { t } = useTranslation();
  const [displayResource, setDisplayResource] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const resourceTypesWithoutMissing = resourceTypes
    .filter(rt => rt.id !== 'missing')
    .map(rt => ({ id: rt.id, name: rt.name }));

  const toggleDisplayResource = () => setDisplayResource(prev => !prev);

  const toggleAddModal = () => setShowAddModal(prev => !prev);

  return (
    <>
      <ResourceGroupBanner>{topicName}</ResourceGroupBanner>

      {false && (
        <AddResourceModal
          resourceTypes={resourceTypesWithoutMissing}
          nodeId={currentNodeId}
          onClose={() => setShowAddModal(false)}
          existingResourceIds={nodeResources.map(r => r.id)}
        />
      )}
      <ResourceItems resources={nodeResources} currentNodeId={currentNodeId} />
    </>
  );
};

export default AllResourcesGroup;
