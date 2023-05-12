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
import { IUserData } from '@ndla/types-backend/build/draft-api';
import { FieldHeader } from '@ndla/forms';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';
import { ResourceType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import ResourceItems from './ResourceItems';
import AddResourceModal from '../plannedResource/AddResourceModal';
import Resource from './Resource';
import { NodeResourceMeta, useNodes } from '../../../modules/nodes/nodeQueries';
import ResourceBanner from './ResourceBanner';
import { Dictionary } from '../../../interfaces';
import { groupResourcesByType } from '../../../util/taxonomyHelpers';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { useAuth0Responsibles } from '../../../modules/auth0/auth0Queries';
import { DRAFT_WRITE_SCOPE } from '../../../constants';
import PlannedResourceForm from '../plannedResource/PlannedResourceForm';
import AddExistingResource from '../plannedResource/AddExistingResource';

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
  userData: IUserData | undefined;
}
const ResourcesContainer = ({
  resourceTypes,
  nodeResources,
  currentNode,
  contentMeta,
  grouped,
  setCurrentNode,
  contentMetaLoading,
  userData,
}: Props) => {
  const { t } = useTranslation();
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
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
              onClick={() => setShowAddResourceModal((prev) => !prev)}
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
        {showAddResourceModal && (
          <AddResourceModal
            onClose={() => setShowAddResourceModal(false)}
            title={t('taxonomy.addResource')}
          >
            <FieldHeader title={t('taxonomy.createResource')} />
            <PlannedResourceForm
              onClose={() => setShowAddResourceModal(false)}
              articleType="standard"
              node={currentNode}
              userData={userData}
            />
            <FieldHeader title={t('taxonomy.getExisting')} />
            <AddExistingResource
              resourceTypes={resourceTypesWithoutMissing}
              nodeId={currentNodeId}
              onClose={() => setShowAddResourceModal(false)}
              existingResourceIds={nodeResources.map((r) => r.id)}
            />
          </AddResourceModal>
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
