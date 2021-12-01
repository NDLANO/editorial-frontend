/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from '@ndla/icons/action';
import BEMHelper from 'react-bem-helper';
import AddNodeResourceButton from './AddNodeResourceButton';
import Accordion from '../../../components/Accordion';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { ResourceWithNodeConnection } from '../../../modules/taxonomy/nodes/nodeApiTypes';

export const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

interface Props {
  currentNodeId: string;
  nodeResources: ResourceWithNodeConnection[];
  resourceTypes: ResourceType[];
}

const AllResourcesGroup = ({ resourceTypes, nodeResources, currentNodeId }: Props) => {
  const { t } = useTranslation();
  const [displayResource, setDisplayResource] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const resourceTypesWithoutMissing = resourceTypes.filter(rt => rt.id !== 'missing');

  const toggleDisplayResource = () => {
    setDisplayResource(prev => !prev);
  };

  const toggleAddModal = () => {
    setShowAddModal(prev => !prev);
  };

  return (
    <>
      <Accordion
        addButton={
          <AddNodeResourceButton stripped onClick={toggleAddModal}>
            <Plus />
            {t('taxonomy.addResource')}
          </AddNodeResourceButton>
        }
        handleToggle={toggleDisplayResource}
        appearance={ButtonAppearance.RESOURCEGROUP}
        header={t('taxonomy.resources')}
        hidden={!displayResource}>
        <ResourceItems resources={nodeResources} currentNodeId={currentNodeId} />
      </Accordion>
      {showAddModal && (
        <AddResourceModal
          resourceTypes={resourceTypesWithoutMissing}
          nodeId={currentNodeId}
          onClose={() => setShowAddModal(false)}
          existingResourceIds={nodeResources.map(r => r.id)}
        />
      )}
    </>
  );
};

export default AllResourcesGroup;
