/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from '@ndla/icons/action';
import BEMHelper from 'react-bem-helper';
import AddNodeResourceButton from './AddNodeResourceButton';
import Accordion from '../../../components/Accordion';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';

import { RESOURCE_TYPE_LEARNING_PATH } from '../../../constants';
import { ButtonAppearance } from '../../../components/Accordion/types';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { ResourceWithNodeConnection } from '../../../modules/taxonomy/nodes/nodeApiTypes';

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

  const handleToggle = () => {
    setDisplayResource(!displayResource);
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  return (
    <>
      <Accordion
        addButton={
          <AddNodeResourceButton stripped onClick={toggleAddModal} disabled={resourceType.disabled}>
            <Plus />
            {t('taxonomy.addResource')}
          </AddNodeResourceButton>
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
