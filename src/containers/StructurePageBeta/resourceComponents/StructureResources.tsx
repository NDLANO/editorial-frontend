/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { RefObject } from 'react';
import { TFunction } from 'i18next';
import { ChildNodeType, ResourceWithNodeConnection } from '../../../modules/nodes/nodeApiTypes';
import {
  ResourceResourceType,
  ResourceType,
} from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { useResourcesWithNodeConnection } from '../../../modules/nodes/nodeQueries';
import { useAllResourceTypes } from '../../../modules/taxonomy/resourcetypes/resourceTypesQueries';
import NodeDescription from './NodeDescription';
import handleError from '../../../util/handleError';
import AllResourcesGroup from './AllResourcesGroup';
import ResourceGroup from './ResourceGroup';
import { groupSortResourceTypesFromNodeResources } from '../../../util/taxonomyHelpers';
import GroupTopicResources from '../folderComponents/topicMenuOptions/GroupTopicResources';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDiv = styled('div')`
  width: calc(${spacing.large} * 5);
  margin-left: auto;
  margin-right: calc(${spacing.nsmall});
`;

interface Props {
  currentChildNode: ChildNodeType;
  resourceRef: RefObject<HTMLDivElement>;
  onCurrentNodeChanged: (changedNode: ChildNodeType) => void;
}

const getMissingResourceType = (t: TFunction): ResourceType & { disabled?: boolean } => ({
  id: 'missing',
  name: t('taxonomy.missingResourceType'),
  disabled: true,
});

const missingObject: ResourceResourceType = { id: 'missing', name: '', connectionId: '' };
const withMissing = (r: ResourceWithNodeConnection): ResourceWithNodeConnection => ({
  ...r,
  resourceTypes: [missingObject],
});

const StructureResources = ({ currentChildNode, resourceRef, onCurrentNodeChanged }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const grouped = currentChildNode?.metadata?.customFields['topic-resources'] ?? 'grouped';

  const { data: nodeResources } = useResourcesWithNodeConnection(
    currentChildNode.id,
    { language: i18n.language },
    taxonomyVersion,
    {
      select: resources => resources.map(r => (r.resourceTypes.length > 0 ? r : withMissing(r))),
      onError: e => handleError(e),
      placeholderData: [],
    },
  );

  const { data: resourceTypes } = useAllResourceTypes(i18n.language, {
    select: resourceTypes => resourceTypes.concat(getMissingResourceType(t)),
    onError: e => handleError(e),
  });

  const groupedNodeResources = groupSortResourceTypesFromNodeResources(
    resourceTypes ?? [],
    nodeResources ?? [],
  );

  return (
    <div ref={resourceRef}>
      {currentChildNode && currentChildNode.id && (
        <StyledDiv>
          <GroupTopicResources
            node={currentChildNode}
            hideIcon
            onChanged={partialMeta => {
              onCurrentNodeChanged({
                ...currentChildNode,
                metadata: { ...currentChildNode.metadata, ...partialMeta },
              });
            }}
          />
        </StyledDiv>
      )}
      <NodeDescription currentNode={currentChildNode} />
      {grouped === 'ungrouped' && (
        <AllResourcesGroup
          key="ungrouped"
          nodeResources={nodeResources ?? []}
          resourceTypes={resourceTypes ?? []}
          currentNodeId={currentChildNode.id}
        />
      )}
      {grouped === 'grouped' &&
        resourceTypes?.map(resourceType => {
          const nodeResource = groupedNodeResources.find(
            resource => resource.id === resourceType.id,
          );
          return (
            <ResourceGroup
              key={resourceType.id}
              resourceType={resourceType}
              resources={nodeResource?.resources}
              currentNodeId={currentChildNode.id}
            />
          );
        })}
    </div>
  );
};

export default memo(StructureResources);
