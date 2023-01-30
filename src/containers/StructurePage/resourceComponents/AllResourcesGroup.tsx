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
import { Plus } from '@ndla/icons/action';
import Tooltip from '@ndla/tooltip';
import compact from 'lodash/compact';
import { Spinner } from '@ndla/icons';
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

const ResourceWrapper = styled.div`
  max-height: 80vh;
  overflow-y: auto;
`;

interface Props {
  nodeResources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: ResourceType[];
  currentNode: ChildNodeType;
  contentMeta: Dictionary<NodeResourceMeta>;
  grouped: boolean;
  setCurrentNode: (changedNode: ChildNodeType) => void;
  contentMetaLoading: boolean;
}

const AllResourcesGroup = ({
  resourceTypes,
  nodeResources,
  currentNode,
  contentMeta,
  grouped,
  setCurrentNode,
  contentMetaLoading,
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
        currentNode={currentNode}
        onCurrentNodeChanged={setCurrentNode}
        addButton={
          <AddResourceButton onClick={toggleAddModal}>
            <Tooltip tooltip={t('taxonomy.addResource')}>
              <Plus />
            </Tooltip>
          </AddResourceButton>
        }
        articleIds={articleIds}
      />
      <ResourceWrapper>
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
            contentMetaLoading={contentMetaLoading}
          />
        )}
        {contentMetaLoading ? (
          <Spinner />
        ) : (
          <>
            {grouped ? (
              mapping?.map(resource => (
                <ResourceItems
                  key={resource.id}
                  resources={resource.resources}
                  currentNodeId={currentNodeId}
                  contentMeta={contentMeta}
                  contentMetaLoading={contentMetaLoading}
                />
              ))
            ) : (
              <ResourceItems
                resources={nodeResources}
                currentNodeId={currentNodeId}
                contentMeta={contentMeta}
                contentMetaLoading={contentMetaLoading}
              />
            )}
          </>
        )}
      </ResourceWrapper>
    </>
  );
};

export default AllResourcesGroup;
