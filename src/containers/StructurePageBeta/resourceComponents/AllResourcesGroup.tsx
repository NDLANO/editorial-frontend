/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from '@ndla/icons/action';
import BEMHelper from 'react-bem-helper';
import { StructureResource } from '../../../modules/nodes/nodeApiTypes';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import Accordion from '../../../components/Accordion';
import { ButtonAppearance } from '../../../components/Accordion/types';
import ResourceItems from './ResourceItems';
import AddResourceButton from './AddResourceButton';

export const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

interface Props {
  currentNodeId: string;
  nodeResources: StructureResource[];
  resourceTypes: ResourceType[];
}

const AllResourcesGroup = ({ resourceTypes, nodeResources, currentNodeId }: Props) => {
  const { t } = useTranslation();
  const [displayResource, setDisplayResource] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  // const resourceTypesWithoutMissing = resourceTypes.filter(rt => rt.id !== 'missing');

  const toggleDisplayResource = () => setDisplayResource(prev => !prev);

  const toggleAddModal = () => setShowAddModal(prev => !prev);

  return (
    <>
      <Accordion
        addButton={
          <AddResourceButton stripped onClick={toggleAddModal}>
            <Plus />
            {t('taxonomy.addResource')}
          </AddResourceButton>
        }
        handleToggle={toggleDisplayResource}
        appearance={ButtonAppearance.RESOURCEGROUP}
        header={t('taxonomy.resources')}
        hidden={!displayResource}>
        <ResourceItems resources={nodeResources} currentNodeId={currentNodeId} />
      </Accordion>
      {/* {showAddModal && (
        <AddResourceModal
          resourceTypes={resourceTypesWithoutMissing}
          nodeId={currentNodeId}
          onClose={() => setShowAddModal(false)}
          existingResourceIds={nodeResources.map(r => r.id)}
        />
      )} */}
    </>
  );
};

export default AllResourcesGroup;
