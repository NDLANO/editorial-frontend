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
import compact from 'lodash/compact';
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
import { getIdFromUrn, groupResourcesByType } from '../../../util/taxonomyHelpers';

interface Props {
  nodeResources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: ResourceType[];
  currentNode: ChildNodeType;
  contentMeta: Dictionary<NodeResourceMeta>;
  grouped: boolean;
}

const AllResourcesGroup = ({
  resourceTypes,
  nodeResources,
  currentNode,
  contentMeta,
  grouped,
}: Props) => {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const resourceTypesWithoutMissing = resourceTypes
    .filter(rt => rt.id !== 'missing')
    .map(rt => ({ id: rt.id, name: rt.name }));

  const currentNodeId = currentNode.id;

  const toggleAddModal = () => setShowAddModal(prev => !prev);

  const articleIds = compact(
    [currentNode.contentUri, nodeResources.map(n => n.contentUri)]
      .flat()
      .map(id => getIdFromUrn(id)),
  );

  const nodeResourcesWithMeta: ResourceWithNodeConnectionAndMeta[] =
    nodeResources?.map(res => ({
      ...res,
      contentMeta: res.contentUri ? contentMeta[res.contentUri] : undefined,
    })) ?? [];
  const mapping = groupResourcesByType(nodeResourcesWithMeta ?? [], resourceTypes ?? []);

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
        articleIds={articleIds}
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
          currentNodeId={currentNodeId}
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
      {grouped ? (
        mapping?.map(resource => (
          <ResourceItems
            key={resource.id}
            resources={resource.resources}
            currentNodeId={currentNodeId}
            contentMeta={contentMeta}
          />
        ))
      ) : (
        <ResourceItems
          resources={nodeResources}
          currentNodeId={currentNodeId}
          contentMeta={contentMeta}
        />
      )}
    </>
  );
};

export default AllResourcesGroup;
