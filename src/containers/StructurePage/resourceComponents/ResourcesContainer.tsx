/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Plus } from '@ndla/icons/action';
import Tooltip from '@ndla/tooltip';
import compact from 'lodash/compact';
import { Spinner } from '@ndla/icons';
import { IconButtonV2 } from '@ndla/button';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';
import { ChildNodeType } from '../../../modules/nodes/nodeApiTypes';
import Resource from './Resource';
import { NodeResourceMeta } from '../../../modules/nodes/nodeQueries';
import ResourceBanner from './ResourceBanner';
import { Dictionary } from '../../../interfaces';
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

const ResourcesContainer = ({
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
  const resourceTypesWithoutMissing = useMemo(
    () => resourceTypes.filter(rt => rt.id !== 'missing').map(rt => ({ id: rt.id, name: rt.name })),
    [resourceTypes],
  );

  const currentNodeId = currentNode.id;

  const articleIds = useMemo(
    () =>
      compact(
        [currentNode.contentUri, nodeResources.map(n => n.contentUri)]
          .flat()
          .map(id => getIdFromUrn(id)),
      ),
    [currentNode, nodeResources],
  );

  const nodeResourcesWithMeta: ResourceWithNodeConnectionAndMeta[] =
    useMemo(
      () =>
        nodeResources?.map(res => ({
          ...res,
          contentMeta: res.contentUri ? contentMeta[res.contentUri] : undefined,
        })),
      [contentMeta, nodeResources],
    ) ?? [];
  const mapping = groupResourcesByType(nodeResourcesWithMeta ?? [], resourceTypes ?? []);

  return (
    <>
      <ResourceBanner
        title={currentNode.name}
        contentMeta={contentMeta}
        currentNode={currentNode}
        onCurrentNodeChanged={setCurrentNode}
        addButton={
          <Tooltip tooltip={t('taxonomy.addResource')}>
            <IconButtonV2
              onClick={() => setShowAddModal(prev => !prev)}
              size="xsmall"
              variant="stripped"
              aria-label={t('taxonomy.addResource')}>
              <Plus />
            </IconButtonV2>
          </Tooltip>
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
              relevanceId: currentNode.relevanceId,
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

export default ResourcesContainer;
