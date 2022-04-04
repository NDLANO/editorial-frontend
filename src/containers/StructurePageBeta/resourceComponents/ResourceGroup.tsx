/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from '@ndla/icons/action';
import BEMHelper from 'react-bem-helper';
import AddResourceButton from './AddResourceButton';
import Accordion from '../../../components/Accordion';
import ResourceItems from './ResourceItems';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { ResourceWithNodeConnection } from '../../../modules/nodes/nodeApiTypes';
import AddResourceModal from './AddResourceModal';
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';

export const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

interface Props {
  resources?: ResourceWithNodeConnection[];
  resourceType: ResourceType & {
    disabled?: boolean;
  };
  currentNodeId: string;
}
const ResourceGroup = ({ resourceType, resources, currentNodeId }: Props) => {
  const { t } = useTranslation();
  const [displayResource, setDisplayResource] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggle = () => setDisplayResource(prev => !prev);

  const toggleAddModal = () => setShowAddModal(prev => !prev);

  return (
    <>
      <Accordion
        addButton={
          <AddResourceButton stripped onClick={toggleAddModal} disabled={resourceType.disabled}>
            <Plus />
            {t('taxonomy.addResource')}
          </AddResourceButton>
        }
        handleToggle={handleToggle}
        appearance={ButtonAppearance.RESOURCEGROUP}
        header={resourceType.name}
        hidden={resources ? displayResource : true}>
        {resources && <ResourceItems resources={resources} currentNodeId={currentNodeId} />}
      </Accordion>
      {showAddModal && (
        <AddResourceModal
          type={resourceType.id}
          allowPaste={resourceType.id !== RESOURCE_TYPE_LEARNING_PATH}
          nodeId={currentNodeId}
          onClose={toggleAddModal}
          existingResourceIds={resources?.map(r => r.id) ?? []}
        />
      )}
    </>
  );
};

export default ResourceGroup;
