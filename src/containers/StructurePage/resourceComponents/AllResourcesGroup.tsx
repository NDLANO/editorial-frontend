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
import Tooltip from '@ndla/tooltip';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';
import { ChildNodeType } from '../../../modules/nodes/nodeApiTypes';
import Resource from './Resource';
import { NodeResourceMeta } from '../../../modules/nodes/nodeQueries';
import ResourceBanner from './ResourceBanner';
import { Dictionary } from '../../../interfaces';
import AddResourceButton from './AddResourceButton';

interface Props {
  nodeResources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: ResourceType[];
  currentNode: ChildNodeType;
  contentMeta: Dictionary<NodeResourceMeta>;
}

const AllResourcesGroup = ({ resourceTypes, nodeResources, currentNode, contentMeta }: Props) => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showAddModal, setShowAddModal] = useState(false);
  const resourceTypesWithoutMissing = resourceTypes
    .filter(rt => rt.id !== 'missing')
    .map(rt => ({ id: rt.id, name: rt.name }));

  const currentNodeId = currentNode.id;

  const toggleAddModal = () => setShowAddModal(prev => !prev);

  return (
    <>
      <ResourceBanner
        title={currentNode.name}
        contentMeta={contentMeta}
        addButton={
          <AddResourceButton onClick={toggleAddModal}>
            <Tooltip tooltip={t('taxonomy.addResource')}>
              <Plus />
            </Tooltip>
          </AddResourceButton>
        }
      />

      {showAddModal && (
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
            contentMeta: currentNode.contentUri ? contentMeta[currentNode.contentUri] : undefined,
            resourceTypes: [],
            relevanceId: currentNode.relevanceId!,
          }}
        />
      )}
      <ResourceItems
        resources={nodeResources}
        currentNodeId={currentNodeId}
        contentMeta={contentMeta}
      />
    </>
  );
};

export default AllResourcesGroup;
