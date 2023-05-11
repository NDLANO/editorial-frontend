/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import keyBy from 'lodash/keyBy';
import styled from '@emotion/styled';
import { Plus } from '@ndla/icons/action';
import Tooltip from '@ndla/tooltip';
import { Spinner } from '@ndla/icons';
import { IconButtonV2 } from '@ndla/button';
import { breakpoints, mq } from '@ndla/core';
import { NodeChild } from '@ndla/types-taxonomy';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import ResourceItems from './ResourceItems';
import AddResourceModal from './AddResourceModal';
import Resource from './Resource';
import { NodeResourceMeta, useNodes } from '../../../modules/nodes/nodeQueries';
import ResourceBanner from './ResourceBanner';
import { Dictionary } from '../../../interfaces';
import { groupResourcesByType } from '../../../util/taxonomyHelpers';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { useAuth0Responsibles } from '../../../modules/auth0/auth0Queries';
import { DRAFT_WRITE_SCOPE } from '../../../constants';
import PlannedResourceFormModal from '../plannedResource/PlannedResourceFormModal';

const ResourceWrapper = styled.div`
  overflow-y: auto;
  ${mq.range({ from: breakpoints.desktop })} {
    max-height: 80vh;
  }
`;

interface Props {
  nodeResources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: ResourceType[];
  currentNode: NodeChild;
  contentMeta: Dictionary<NodeResourceMeta>;
  grouped: boolean;
  setCurrentNode: (changedNode: NodeChild) => void;
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
  const [showPlannedResourceModal, setShowPlannedResourceModal] = useState(false);
  const resourceTypesWithoutMissing = useMemo(
    () =>
      resourceTypes.filter((rt) => rt.id !== 'missing').map((rt) => ({ id: rt.id, name: rt.name })),
    [resourceTypes],
  );
  const { taxonomyVersion } = useTaxonomyVersion();
  const currentNodeId = currentNode.id;

  const { data: users } = useAuth0Responsibles(
    { permission: DRAFT_WRITE_SCOPE },
    { select: (users) => keyBy(users, (u) => u.app_metadata.ndla_id) },
  );

  const { data } = useNodes(
    { contentURI: currentNode.contentUri!, taxonomyVersion },
    { enabled: !!currentNode.contentUri },
  );

  const paths = useMemo(() => data?.map((d) => d.path).filter((d) => !!d) ?? [], [data]);

  const nodeResourcesWithMeta: ResourceWithNodeConnectionAndMeta[] =
    useMemo(
      () =>
        nodeResources?.map((res) => ({
          ...res,
          contentMeta: res.contentUri ? contentMeta[res.contentUri] : undefined,
        })),
      [contentMeta, nodeResources],
    ) ?? [];
  const mapping = groupResourcesByType(nodeResourcesWithMeta ?? [], resourceTypes ?? []);
  const currentMeta = currentNode.contentUri ? contentMeta[currentNode.contentUri] : undefined;

  return (
    <>
      <ResourceBanner
        resources={nodeResourcesWithMeta}
        title={currentNode.name}
        contentMeta={contentMeta}
        currentNode={currentNode}
        onCurrentNodeChanged={setCurrentNode}
        addButton={
          <Tooltip tooltip={t('taxonomy.addResource')}>
            <IconButtonV2
              onClick={() => setShowAddModal((prev) => !prev)}
              size="xsmall"
              variant="stripped"
              aria-label={t('taxonomy.addResource')}
            >
              <Plus />
            </IconButtonV2>
          </Tooltip>
        }
      />
      <ResourceWrapper>
        {showAddModal && (
          <AddResourceModal
            resourceTypes={resourceTypesWithoutMissing}
            nodeId={currentNodeId}
            onClose={() => setShowAddModal(false)}
            existingResourceIds={nodeResources.map((r) => r.id)}
            setShowAddModal={setShowAddModal}
            setShowPlannedResourceModal={setShowPlannedResourceModal}
          />
        )}
        {showPlannedResourceModal && (
          <PlannedResourceFormModal
            onClose={() => setShowPlannedResourceModal(false)}
            articleType="standard"
            nodeId={currentNodeId}
          />
        )}
        {currentNode.name && (
          <Resource
            currentNodeId={currentNode.id}
            responsible={
              currentMeta?.responsible
                ? users?.[currentMeta.responsible.responsibleId]?.name
                : undefined
            }
            resource={{
              ...currentNode,
              paths,
              contentMeta: currentMeta,
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
              mapping?.map((resource) => (
                <ResourceItems
                  key={resource.id}
                  resources={resource.resources}
                  currentNodeId={currentNodeId}
                  contentMeta={contentMeta}
                  contentMetaLoading={contentMetaLoading}
                  users={users}
                />
              ))
            ) : (
              <ResourceItems
                resources={nodeResources}
                currentNodeId={currentNodeId}
                contentMeta={contentMeta}
                contentMetaLoading={contentMetaLoading}
                users={users}
              />
            )}
          </>
        )}
      </ResourceWrapper>
    </>
  );
};

export default ResourcesContainer;
